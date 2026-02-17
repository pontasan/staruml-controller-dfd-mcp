#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('dfd', DIR, async (ctx) => {
  let s = ctx.step('Create DFD diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/dfd/diagrams', { name: 'Test DFD' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create external entity');
  let extId;
  try {
    const res = await apiPost('/api/dfd/external-entities', { diagramId, name: 'Customer', x1: 50, y1: 50, x2: 180, y2: 120 });
    extId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create process');
  let procId;
  try {
    const res = await apiPost('/api/dfd/processes', { diagramId, name: 'Process Order', x1: 300, y1: 50, x2: 430, y2: 120 });
    procId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create data store');
  let dsId;
  try {
    const res = await apiPost('/api/dfd/data-stores', { diagramId, name: 'Orders DB', x1: 300, y1: 200, x2: 430, y2: 260 });
    dsId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create data flow: Customer → Process');
  try {
    await apiPost('/api/dfd/data-flows', { diagramId, sourceId: extId, targetId: procId, name: 'Order Request' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create data flow: Process → DataStore');
  try {
    await apiPost('/api/dfd/data-flows', { diagramId, sourceId: procId, targetId: dsId, name: 'Store Order' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export DFD image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/dfd/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
