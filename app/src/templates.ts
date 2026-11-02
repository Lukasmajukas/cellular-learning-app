// Fills {band:B71.dl_low_mhz}, {carrier_use:n71/tmobile.status}, {change:0.to} and {code:310-260.shows_as} and {site:type:lattice.text}, {hardware:form:radio-unit.text} and {cellid:lte:eci.text} from the data files.
// A lesson never types a frequency itself. A missing fact or field is an error on purpose (loud, not silent).
export type Row = Record<string, unknown>;
export type PhotoRow = { id: string; file: string; title: string; author: string; licence: string };
export type Data = { bands: Row[]; carrier_use: Row[]; spectrum_changes: Row[]; carrier_codes: Row[]; photos?: PhotoRow[]; sites?: Row[]; hardware?: Row[]; cell_ids?: Row[] };

export function lookup(ref: string, data: Data): unknown {
  const m = /^(band|carrier_use|change|code|site|hardware|cellid):([^.]+)\.(\w+)$/.exec(ref.trim());
  if (!m) throw new Error(`Bad fact reference: ${ref}`);
  const [, kind, key, field] = m;
  let row: Row | undefined;
  if (kind === 'band') row = data.bands.find(b => b.id === key);
  else if (kind === 'carrier_use') { const [band, carrier] = key.split('/'); row = data.carrier_use.find(r => r.band === band && r.carrier_id === carrier); }
  else if (kind === 'site') row = data.sites?.find(r => r.id === key);
  else if (kind === 'hardware') row = data.hardware?.find(r => r.id === key);
  else if (kind === 'cellid') row = data.cell_ids?.find(r => r.id === key);
  else if (kind === 'code') row = data.carrier_codes.find(c => c.id === key);
  else row = data.spectrum_changes[Number(key)];
  if (!row) throw new Error(`No such fact: ${kind}:${key}`);
  if (!(field in row) || row[field] === null || row[field] === undefined) throw new Error(`Fact ${kind}:${key} has no field "${field}"`);
  return row[field];
}
export const fill = (text: string, data: Data): string =>
  text.replace(/\{([^}]+)\}/g, (_, ref) => {
    const v = lookup(ref, data);
    return typeof v === 'number' ? String(v) : String(v);
  });
