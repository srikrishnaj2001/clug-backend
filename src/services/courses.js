const { Course, Module, Section, Program, Video, Resource, Example } = require('../database/models');

async function findAll() {
  const rows = await Course.findAll({ order: [['id', 'ASC']] });
  return { success: true, statusCode: 200, data: rows };
}

async function findOne(id) {
  const row = await Course.findByPk(id, {
    include: [
      { model: Program, as: 'program', attributes: ['id', 'name'] },
      {
        model: Module,
        as: 'modules',
        attributes: ['id', 'name', 'description', 'cohortId', 'startDate', 'endDate'],
        include: [
          {
            model: Section,
            as: 'sections',
            attributes: ['id', 'name', 'description', 'type', 'contentId', 'sectionId']
          }
        ]
      }
    ],
    order: [
      [{ model: Module, as: 'modules' }, 'id', 'ASC'],
      [{ model: Module, as: 'modules' }, { model: Section, as: 'sections' }, 'id', 'ASC']
    ],
    subQuery: false
  });
  if (!row) return { success: false, statusCode: 404, message: 'Course not found' };

  const course = row.toJSON();

  // Collect contentIds by type across all modules/sections
  const videoIds = [];
  const resourceIds = [];
  const exampleIds = [];
  for (const mod of course.modules || []) {
    for (const sec of mod.sections || []) {
      const t = (sec.type || '').toUpperCase();
      if (t === 'VIDEO' && sec.contentId) videoIds.push(sec.contentId);
      if (t === 'RESOURCE' && sec.contentId) resourceIds.push(sec.contentId);
      if (t === 'EXAMPLE' && sec.contentId) exampleIds.push(sec.contentId);
    }
  }

  // Bulk fetch content
  const [videos, resources, examples] = await Promise.all([
    videoIds.length
      ? Video.findAll({ attributes: ['id', 'name', 'description', 'url', 'transcript'], where: { id: videoIds } })
      : Promise.resolve([]),
    resourceIds.length
      ? Resource.findAll({ attributes: ['id', 'name', 'description', 'url'], where: { id: resourceIds } })
      : Promise.resolve([]),
    exampleIds.length
      ? Example.findAll({ attributes: ['id', 'name', 'description', 'industry'], where: { id: exampleIds } })
      : Promise.resolve([])
  ]);

  const videoMap = new Map(videos.map(v => [v.id, v.toJSON ? v.toJSON() : v]));
  const resourceMap = new Map(resources.map(r => [r.id, r.toJSON ? r.toJSON() : r]));
  const exampleMap = new Map(examples.map(e => [e.id, e.toJSON ? e.toJSON() : e]));

  // Create a lookup from parent section id -> child sections
  const parentIdToChildren = new Map();
  for (const mod of course.modules || []) {
    for (const sec of mod.sections || []) {
      if (sec.sectionId) {
        const list = parentIdToChildren.get(sec.sectionId) || [];
        list.push(sec);
        parentIdToChildren.set(sec.sectionId, list);
      }
    }
  }

  // Build transformed response with section.content attached
  const transformed = {
    id: course.id,
    name: course.name,
    description: course.description,
    programId: course.programId,
    thumbnailUrl: course.thumbnailUrl,
    program: course.program || null,
    modules: (course.modules || []).map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      cohortId: m.cohortId,
      startDate: m.startDate,
      endDate: m.endDate,
      // Only include top-level sections (exclude children); nest children under their parent video
      sections: (m.sections || [])
        .filter(s => !s.sectionId)
        .map(s => {
          const t = (s.type || '').toUpperCase();
          let content = null;

          if (t === 'VIDEO') {
            const v = videoMap.get(s.contentId);
            const children = parentIdToChildren.get(s.id) || [];

            // Separate child resources and examples
            const childResources = [];
            const childExamples = [];
            for (const child of children) {
              const ct = (child.type || '').toUpperCase();
              if (ct === 'RESOURCE') {
                const r = resourceMap.get(child.contentId);
                if (r) childResources.push({ id: r.id, name: r.name, description: r.description, url: r.url, type: 'resource' });
              } else if (ct === 'EXAMPLE') {
                const e = exampleMap.get(child.contentId);
                if (e) childExamples.push({ id: e.id, name: e.name, description: e.description, industry: e.industry, type: 'example' });
              }
            }

            if (v) {
              content = {
                id: v.id,
                name: v.name,
                description: v.description,
                url: v.url,
                transcript: v.transcript,
                type: 'video',
                resources: childResources,
                examples: childExamples
              };
            } else {
              // Even if video content is missing, still return a video content shell to carry children
              content = { id: s.contentId, type: 'video', resources: childResources, examples: childExamples };
            }
          } else if (t === 'RESOURCE') {
            const r = resourceMap.get(s.contentId);
            if (r) content = { id: r.id, name: r.name, description: r.description, url: r.url, type: 'resource' };
          } else if (t === 'EXAMPLE') {
            const e = exampleMap.get(s.contentId);
            if (e) content = { id: e.id, name: e.name, description: e.description, industry: e.industry, type: 'example' };
          }

          return {
            id: s.id,
            name: s.name,
            description: s.description,
            type: s.type,
            contentId: s.contentId,
            sectionId: s.sectionId,
            content
          };
        })
    }))
  };

  return { success: true, statusCode: 200, data: transformed };
}

module.exports = { findAll, findOne }; 