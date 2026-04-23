export interface RosterPlayer {
  n: number;
  name: string;
  pos: string;
  role: string;
}

export const ROSTER_IRE: RosterPlayer[] = [
  { n:  1, name: 'Porter',        pos: 'Loosehead Prop',    role: 'Jumper lift · front pod' },
  { n:  2, name: 'Sheehan',       pos: 'Hooker',            role: 'Thrower · hits 8 at tail' },
  { n:  3, name: 'Furlong',       pos: 'Tighthead Prop',    role: 'Lift · middle pod' },
  { n:  4, name: 'Ryan',          pos: 'Lock',              role: 'Jumper · 2-man option' },
  { n:  5, name: 'Henderson',     pos: 'Lock',              role: 'Lift · tail' },
  { n:  6, name: "O'Mahony",      pos: 'Blindside Flanker', role: 'Lift · tail (capt.)' },
  { n:  7, name: 'van der Flier', pos: 'Openside Flanker',  role: 'Jumper · tail pod' },
  { n:  8, name: 'Doris',         pos: 'Number 8',          role: 'Receives off top' },
  { n:  9, name: 'Gibson-Park',   pos: 'Scrum-half',        role: 'First receiver · pulls flat' },
  { n: 10, name: 'Crowley',       pos: 'Fly-half',          role: 'Cut line · distributor' },
  { n: 11, name: 'Lowe',          pos: 'Left Wing',         role: 'Blindside option' },
  { n: 12, name: 'Aki',           pos: 'Inside Centre',     role: 'Crash line · hold-up' },
  { n: 13, name: 'Ringrose',      pos: 'Outside Centre',    role: 'Strike receiver (skip)' },
  { n: 14, name: 'Keenan',        pos: 'Right Wing',        role: 'Finisher · outside shoulder' },
  { n: 15, name: 'Hansen',        pos: 'Fullback',          role: 'Deep insertion · late' },
];
