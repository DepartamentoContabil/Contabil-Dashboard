import { useState, useRef } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
} from 'recharts';
import { useData, DEFAULT_CSV_URL } from '@/hooks/useData';
import { MESES } from '@/data/sampleData';
import type { EmpresaRow, EcdEcfRow, ReinfRow, ImplementacaoRow } from '@/data/sampleData';

const NAVY = '#0d1b2a';
const BLUE2 = '#1e4068';
const ORANGE = '#d95c12';
const GREEN = '#15803d';
const RED = '#dc2626';
const YELLOW = '#d97706';
const COLORS = [ORANGE, BLUE2, '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#14b8a6'];

type NavSection = 'home' | 'empresas' | 'integ' | 'regime' | 'ativ' | 'folha' | 'status' | 'comp' | 'fecm' | 'obrig';
type ObrigTab = 'ecd' | 'reinf' | 'impl';

function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, row) => {
    const v = String(row[key] || '–');
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(counts: Record<string, number>) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'EM DIA') return <span className="badge-green">{status}</span>;
  if (status === 'EM ATRASO') return <span className="badge-red">{status}</span>;
  if (status === 'PENDENTE') return <span className="badge-yellow">{status}</span>;
  if (status === 'NÃO OBRIGADA') return <span className="badge-blue">{status}</span>;
  if (status === 'SEM MOVIMENTO') return <span className="badge-gray">{status}</span>;
  if (status === 'ENVIADA') return <span className="badge-green">{status}</span>;
  if (status === 'SIM') return <span className="badge-green">{status}</span>;
  if (status === 'NÃO') return <span className="badge-red">{status}</span>;
  return <span className="badge-gray">{status || '–'}</span>;
}

function CheckMark({ val }: { val: string }) {
  if (val && val.trim() && val !== '–')
    return <span style={{ color: GREEN, fontWeight: 700 }}>✓</span>;
  return <span style={{ color: '#cbd5e1' }}>–</span>;
}

interface DrillModalProps {
  title: string;
  data: EmpresaRow[];
  onClose: () => void;
  columns: { key: keyof EmpresaRow; label: string }[];
}

function DrillModal({ title, data, onClose, columns }: DrillModalProps) {
  const [search, setSearch] = useState('');
  const filtered = data.filter(r =>
    r.empresa.toLowerCase().includes(search.toLowerCase()) || r.cnpj.includes(search)
  );
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>{title}</span>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <div className="modal-body">
          <input placeholder="Buscar empresa ou CNPJ..." value={search}
            onChange={e => setSearch(e.target.value)} className="modal-search" />
          <div className="table-wrap" style={{ maxHeight: '55vh' }}>
            <table className="data-table">
              <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
              <tbody>
                {filtered.slice(0, 200).map((row, i) => (
                  <tr key={i}>
                    {columns.map(c => (
                      <td key={c.key}>
                        {c.key === 'statusFechamento'
                          ? <StatusBadge status={row[c.key]} />
                          : String(row[c.key] || '–')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="modal-count">{filtered.length} registros</p>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────

interface SectionProps {
  empresas: EmpresaRow[];
  responsaveis: string[];
  openDrill: (filter: 'all' | 'dia' | 'at') => void;
  openDrillByField: (field: keyof EmpresaRow, value: string) => void;
  setDrillData: (d: EmpresaRow[]) => void;
  setDrillTitle: (t: string) => void;
  setDrillCols: (c: { key: keyof EmpresaRow; label: string }[]) => void;
}

function EmpresasSection({ empresas, responsaveis, openDrillByField }: SectionProps) {
  const [resp, setResp] = useState('');
  const [s, setS] = useState('');
  const chartData = toChartData(countBy(empresas, 'responsavel'));
  const statusChartData = responsaveis.map(r => {
    const sub = empresas.filter(e => e.responsavel === r);
    return {
      name: r,
      'Em Dia': sub.filter(e => e.statusFechamento === 'EM DIA').length,
      'Em Atraso': sub.filter(e => e.statusFechamento === 'EM ATRASO').length,
    };
  });
  const filtered = empresas.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="section-title">🏢 Empresas</div>
      <div className="section-sub">{empresas.length} empresas na base · ordem alfabética</div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Por Responsável</div></div>
            <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer"
                onClick={(d: { name: string }) => openDrillByField('responsavel', d.name)}>
                <LabelList dataKey="value" position="top" style={{ fontSize: 12, fontWeight: 700 }} />
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Status por Responsável</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Legend />
              <Bar dataKey="Em Dia" fill={GREEN} radius={[4, 4, 0, 0]} stackId="a" cursor="pointer" />
              <Bar dataKey="Em Atraso" fill={RED} radius={[4, 4, 0, 0]} stackId="a" cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Todas as Empresas</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar empresa..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Integração</th><th>Atividade</th><th>Regime</th><th>Folha</th><th>Responsável</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.integracaoFinanceira}</td>
                  <td>{row.atividadeOperacional}</td>
                  <td>{row.regimeTributario}</td>
                  <td>{row.folhaPagamento}</td>
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

interface GenericSectionProps {
  title: string; subtitle: string; field: keyof EmpresaRow; label: string;
  rows: EmpresaRow[]; extraCols: { key: keyof EmpresaRow; label: string }[];
  responsaveis: string[];
  openDrillByField: (field: keyof EmpresaRow, value: string) => void;
}

function GenericSection({ title, subtitle, field, label, rows, extraCols, responsaveis, openDrillByField }: GenericSectionProps) {
  const [resp, setResp] = useState('');
  const [val, setVal] = useState('');
  const [s, setS] = useState('');
  const counts = countBy(rows.filter(e => !resp || e.responsavel === resp), field);
  const chartData = toChartData(counts);
  const unique = [...new Set(rows.map(e => String(e[field])).filter(Boolean))].sort();
  const filtered = rows.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (val && String(e[field]) !== val) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="section-title">{title}</div>
      <div className="section-sub">{subtitle}</div>
      <div className="chart-card">
        <div className="chart-card-header">
          <div><div className="chart-card-title"><span className="dot-orange" />{label}</div></div>
          <div className="chart-filters">
            <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select" value={val} onChange={e => setVal(e.target.value)}>
              <option value="">Todos</option>
              {unique.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill={ORANGE} radius={[0, 4, 4, 0]} cursor="pointer"
              onClick={(d: { name: string }) => openDrillByField(field, d.name)}>
              <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700 }} />
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>{label} — Lista Analítica</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select-dark" value={val} onChange={e => setVal(e.target.value)}>
              <option value="">Todos</option>
              {unique.map(u => <option key={u}>{u}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar empresa..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>CNPJ</th><th>Empresa</th><th>Cód.</th>
                {extraCols.map(c => <th key={c.key}>{c.label}</th>)}
                <th>Responsável</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  {extraCols.map(c => <td key={c.key}>{String(row[c.key] || '–')}</td>)}
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

function RegimeSection({ empresas, responsaveis, openDrillByField }: SectionProps) {
  const [resp, setResp] = useState('');
  const [val, setVal] = useState('');
  const [s, setS] = useState('');
  const filtered = empresas.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (val && e.regimeTributario !== val) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });
  const chartData = toChartData(countBy(empresas.filter(e => !resp || e.responsavel === resp), 'regimeTributario'));
  const unique = [...new Set(empresas.map(e => e.regimeTributario).filter(Boolean))].sort();

  return (
    <div className="fade-in">
      <div className="section-title">📊 Regime Tributário</div>
      <div className="section-sub">Distribuição por regime</div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Empresas por Regime</div></div>
            <div className="chart-filters">
              <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
                <option value="">Todos Resp.</option>
                {responsaveis.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer"
                onClick={(d: { name: string }) => openDrillByField('regimeTributario', d.name)}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700 }} />
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Proporção</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Regime Tributário</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select-dark" value={val} onChange={e => setVal(e.target.value)}>
              <option value="">Todos os Regimes</option>
              {unique.map(u => <option key={u}>{u}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar empresa..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Regime Tributário</th><th>Responsável</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.regimeTributario}</td>
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

function FolhaSection({ empresas, responsaveis, openDrillByField }: SectionProps) {
  const [resp, setResp] = useState('');
  const [val, setVal] = useState('');
  const [s, setS] = useState('');
  const filteredRows = empresas.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (val && e.folhaPagamento !== val) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });
  const chartData = toChartData(countBy(empresas.filter(e => !resp || e.responsavel === resp), 'folhaPagamento'));
  const unique = [...new Set(empresas.map(e => e.folhaPagamento).filter(Boolean))].sort();

  return (
    <div className="fade-in">
      <div className="section-title">👥 Informação de Folha de Pagamento</div>
      <div className="section-sub">Distribuição por tipo de folha</div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Empresas por Folha</div></div>
            <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos Resp.</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer"
                onClick={(d: { name: string }) => openDrillByField('folhaPagamento', d.name)}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700 }} />
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Proporção</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Folha de Pagamento</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select-dark" value={val} onChange={e => setVal(e.target.value)}>
              <option value="">Todos os Tipos</option>
              {unique.map(u => <option key={u}>{u}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar empresa..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Folha de Pagamento</th><th>Responsável</th><th>Status</th></tr></thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.folhaPagamento}</td>
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filteredRows.length} registros</div>
      </div>
    </div>
  );
}

function StatusSection({ empresas, responsaveis, openDrill }: SectionProps) {
  const [resp, setResp] = useState('');
  const [val, setVal] = useState('');
  const emDia = empresas.filter(e => e.statusFechamento === 'EM DIA').length;
  const emAtraso = empresas.filter(e => e.statusFechamento === 'EM ATRASO').length;
  const filtered = empresas.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (val && e.statusFechamento !== val) return false;
    return true;
  });
  const chartData = [
    { name: 'Em Dia', value: emDia, fill: GREEN },
    { name: 'Em Atraso', value: emAtraso, fill: RED },
  ];

  return (
    <div className="fade-in">
      <div className="section-title">✅ Status de Fechamento</div>
      <div className="section-sub">{emDia} Em Dia · {emAtraso} Em Atraso · {empresas.length} Total</div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Empresas por Status</div></div>
            <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos Resp.</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} cursor="pointer"
                onClick={(d: { name: string }) => openDrill(d.name === 'Em Dia' ? 'dia' : 'at')}>
                <LabelList dataKey="value" position="top" style={{ fontSize: 14, fontWeight: 800 }} />
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />Proporção Em Dia × Em Atraso</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Status de Fechamento</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select-dark" value={val} onChange={e => setVal(e.target.value)}>
              <option value="">Todos os Status</option>
              <option>EM DIA</option><option>EM ATRASO</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Status</th><th>Responsável</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                  <td>{row.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

function CompSection({ empresas, responsaveis, setDrillData, setDrillTitle, setDrillCols }: SectionProps) {
  const [resp, setResp] = useState('');
  const [comp, setComp] = useState('');
  const [st, setSt] = useState('');
  const competencias = [...new Set(empresas.map(e => e.competenciaFechamento).filter(Boolean))].sort();
  const filtered = empresas.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (comp && e.competenciaFechamento !== comp) return false;
    if (st && e.statusFechamento !== st) return false;
    return true;
  });
  const chartData = toChartData(countBy(
    empresas.filter(e => (!resp || e.responsavel === resp) && (!st || e.statusFechamento === st)),
    'competenciaFechamento'
  ));

  return (
    <div className="fade-in">
      <div className="section-title">📅 Competência de Fechamento</div>
      <div className="section-sub">Balancete atualizado até qual competência · por empresa</div>
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-card-header">
          <div><div className="chart-card-title"><span className="dot-orange" />Empresas por Competência</div></div>
          <div className="chart-filters">
            <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos Resp.</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select" value={st} onChange={e => setSt(e.target.value)}>
              <option value="">Todos Status</option>
              <option>EM DIA</option><option>EM ATRASO</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} cursor="pointer"
              onClick={(d: { name: string }) => {
                setDrillData(empresas.filter(e => e.competenciaFechamento === d.name));
                setDrillTitle(`Competência ${d.name}`);
                setDrillCols([
                  { key: 'empresa', label: 'Empresa' }, { key: 'cnpj', label: 'CNPJ' },
                  { key: 'codigo', label: 'Código' }, { key: 'competenciaFechamento', label: 'Competência' },
                  { key: 'statusFechamento', label: 'Status' }, { key: 'responsavel', label: 'Responsável' },
                ]);
              }}>
              <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700 }} />
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Competência de Fechamento</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select-dark" value={comp} onChange={e => setComp(e.target.value)}>
              <option value="">Todas as Competências</option>
              {competencias.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="filter-select-dark" value={st} onChange={e => setSt(e.target.value)}>
              <option value="">Todos os Status</option>
              <option>EM DIA</option><option>EM ATRASO</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Competência</th><th>Status</th><th>Responsável</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.competenciaFechamento || '–'}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                  <td>{row.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

function FecmSection({ empresas, responsaveis }: SectionProps) {
  const [resp, setResp] = useState('');
  const [mes, setMes] = useState('');
  const [st, setSt] = useState('');

  const fechMesData = MESES.map(m => {
    const key = `fech_${m.replace('.', '_')}` as keyof EmpresaRow;
    const fechadas = empresas.filter(e => e[key]);
    return {
      name: m,
      emDia: fechadas.filter(e => e.statusFechamento === 'EM DIA').length,
      emAtraso: fechadas.filter(e => e.statusFechamento === 'EM ATRASO').length,
    };
  });

  const filteredRows: (EmpresaRow & { mesRef: string })[] = [];
  const mesesToFilter = mes ? [mes] : MESES;
  empresas.forEach(e => {
    if (resp && e.responsavel !== resp) return;
    if (st && e.statusFechamento !== st) return;
    mesesToFilter.forEach(m => {
      const key = `fech_${m.replace('.', '_')}` as keyof EmpresaRow;
      if (e[key]) filteredRows.push({ ...e, mesRef: m });
    });
  });

  const chartFiltered = MESES.map(m => {
    const key = `fech_${m.replace('.', '_')}` as keyof EmpresaRow;
    return {
      name: m,
      emDia: empresas.filter(e => e[key] && (!resp || e.responsavel === resp) && (!st || e.statusFechamento === 'EM DIA')).length,
      emAtraso: empresas.filter(e => e[key] && (!resp || e.responsavel === resp) && (!st || e.statusFechamento === 'EM ATRASO')).length,
    };
  });

  return (
    <div className="fade-in">
      <div className="section-title">📆 Fechamentos em Mês</div>
      <div className="section-sub">Empresas fechadas em cada mês e respectivo status</div>
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-card-header">
          <div><div className="chart-card-title"><span className="dot-orange" />Fechamentos por Mês · Em Dia × Em Atraso</div></div>
          <div className="chart-filters">
            <select className="filter-select" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos Resp.</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select" value={st} onChange={e => setSt(e.target.value)}>
              <option value="">Todos Status</option>
              <option>EM DIA</option><option>EM ATRASO</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartFiltered}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Legend />
            <Bar dataKey="emDia" name="Em Dia" fill={GREEN} radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="emAtraso" name="Em Atraso" fill={RED} radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Fechamentos por Mês</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {responsaveis.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="filter-select-dark" value={mes} onChange={e => setMes(e.target.value)}>
              <option value="">Todos os Meses</option>
              {MESES.map(m => <option key={m}>{m}</option>)}
            </select>
            <select className="filter-select-dark" value={st} onChange={e => setSt(e.target.value)}>
              <option value="">Todos os Status</option>
              <option>EM DIA</option><option>EM ATRASO</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Responsável</th><th>Competência</th><th>Fechado em</th><th>Status</th></tr></thead>
            <tbody>
              {filteredRows.slice(0, 300).map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.responsavel}</td>
                  <td>{row.competenciaFechamento || '–'}</td>
                  <td className="bold">{row.mesRef}</td>
                  <td><StatusBadge status={row.statusFechamento} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filteredRows.length} registros</div>
      </div>
    </div>
  );
}

// ─── OBRIGAÇÕES SUB-SECTIONS ──────────────────────────────────────────────────

function EcdTab({ ecdEcf }: { ecdEcf: EcdEcfRow[] }) {
  const [resp, setResp] = useState('');
  const [s, setS] = useState('');
  const filtered = ecdEcf.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });
  const ecdChart = toChartData(countBy(ecdEcf, 'ecd'));
  const ecfChart = toChartData(countBy(ecdEcf, 'ecf'));

  return (
    <div>
      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />ECD 2025 por Status</div></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ecdChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fontWeight: 700, fontSize: 12 }} />
                {ecdChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-header">
            <div><div className="chart-card-title"><span className="dot-orange" />ECF 2025 por Status</div></div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ecfChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fontWeight: 700, fontSize: 12 }} />
                {ecfChart.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 ECD e ECF 2025</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {[...new Set(ecdEcf.map(e => e.responsavel))].map(r => <option key={r}>{r}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Responsável</th><th>ECD</th><th>ECF</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.ecd} /></td>
                  <td><StatusBadge status={row.ecf} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

function ReinfTab({ reinf }: { reinf: ReinfRow[] }) {
  const [resp, setResp] = useState('');
  const [s, setS] = useState('');
  const filtered = reinf.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });
  const trimData = ['t1', 't2', 't3', 't4'].map((t, i) => ({
    name: `${i + 1}º Trimestre`,
    SIM: reinf.filter(e => (e as any)[t] === 'SIM').length,
    NÃO: reinf.filter(e => (e as any)[t] === 'NÃO').length,
  }));

  return (
    <div>
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-card-header">
          <div><div className="chart-card-title"><span className="dot-orange" />ReINF 2025 por Trimestre</div></div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trimData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Legend />
            <Bar dataKey="SIM" fill={GREEN} radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="NÃO" fill={RED} radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 ReINF 2025</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {[...new Set(reinf.map(e => e.responsavel))].map(r => <option key={r}>{r}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Responsável</th><th>1º Trim.</th><th>2º Trim.</th><th>3º Trim.</th><th>4º Trim.</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.t1} /></td>
                  <td><StatusBadge status={row.t2} /></td>
                  <td><StatusBadge status={row.t3} /></td>
                  <td><StatusBadge status={row.t4} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

function ImplTab({ implementacoes }: { implementacoes: ImplementacaoRow[] }) {
  const [resp, setResp] = useState('');
  const [s, setS] = useState('');
  const filtered = implementacoes.filter(e => {
    if (resp && e.responsavel !== resp) return false;
    if (s && !e.empresa.toLowerCase().includes(s.toLowerCase())) return false;
    return true;
  });
  const implChart = [
    { name: 'ONVIO', SIM: implementacoes.filter(e => e.onvio === 'SIM').length, NÃO: implementacoes.filter(e => e.onvio === 'NÃO').length },
    { name: 'NIBO', SIM: implementacoes.filter(e => e.nibo === 'SIM').length, NÃO: implementacoes.filter(e => e.nibo === 'NÃO').length },
    { name: 'FISCAL/FOLHA', SIM: implementacoes.filter(e => e.fiscalFolha === 'SIM').length, NÃO: implementacoes.filter(e => e.fiscalFolha === 'NÃO').length },
  ];

  return (
    <div>
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <div className="chart-card-header">
          <div><div className="chart-card-title"><span className="dot-orange" />Implementações por Sistema</div></div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={implChart}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Legend />
            <Bar dataKey="SIM" fill={GREEN} radius={[4, 4, 0, 0]} />
            <Bar dataKey="NÃO" fill={RED} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="table-card">
        <div className="table-header">
          <span>📋 Implementações</span>
          <div className="table-filters">
            <select className="filter-select-dark" value={resp} onChange={e => setResp(e.target.value)}>
              <option value="">Todos os Responsáveis</option>
              {[...new Set(implementacoes.map(e => e.responsavel))].map(r => <option key={r}>{r}</option>)}
            </select>
            <input className="filter-input" placeholder="Buscar..." value={s} onChange={e => setS(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>CNPJ</th><th>Empresa</th><th>Cód.</th><th>Responsável</th><th>ONVIO</th><th>NIBO</th><th>FISCAL/FOLHA</th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className="mono">{row.cnpj}</td>
                  <td className="bold">{row.empresa}</td>
                  <td className="mono">{row.codigo}</td>
                  <td>{row.responsavel}</td>
                  <td><StatusBadge status={row.onvio} /></td>
                  <td><StatusBadge status={row.nibo} /></td>
                  <td><StatusBadge status={row.fiscalFolha} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{filtered.length} registros</div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data, loading, lastUpdate, error, loadFromURL, handleFileUpload } = useData();
  const [section, setSection] = useState<NavSection>('home');
  const [obrigTab, setObrigTab] = useState<ObrigTab>('ecd');
  const [drillData, setDrillData] = useState<EmpresaRow[] | null>(null);
  const [drillTitle, setDrillTitle] = useState('');
  const [drillCols, setDrillCols] = useState<{ key: keyof EmpresaRow; label: string }[]>([]);
  const [filterResp, setFilterResp] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterComp, setFilterComp] = useState('');
  const [filterMes, setFilterMes] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [csvUrl, setCsvUrl] = useState(DEFAULT_CSV_URL);
  const fileRef = useRef<HTMLInputElement>(null);

  const empresas = data.empresas.sort((a, b) => a.empresa.localeCompare(b.empresa));
  const responsaveis = [...new Set(empresas.map(e => e.responsavel).filter(Boolean))].sort();
  const total = empresas.length;
  const emDia = empresas.filter(e => e.statusFechamento === 'EM DIA').length;
  const emAtraso = empresas.filter(e => e.statusFechamento === 'EM ATRASO').length;
  const percDia = total ? Math.round((emDia / total) * 100) : 0;
  const competencias = [...new Set(empresas.map(e => e.competenciaFechamento).filter(Boolean))].sort();

  function openDrill(filter: 'all' | 'dia' | 'at') {
    const defaultCols: { key: keyof EmpresaRow; label: string }[] = [
      { key: 'empresa', label: 'Empresa' }, { key: 'cnpj', label: 'CNPJ' },
      { key: 'responsavel', label: 'Responsável' }, { key: 'competenciaFechamento', label: 'Competência' },
      { key: 'statusFechamento', label: 'Status' },
    ];
    let d = empresas;
    let t = 'Todas as Empresas';
    if (filter === 'dia') { d = empresas.filter(e => e.statusFechamento === 'EM DIA'); t = 'Empresas Em Dia'; }
    if (filter === 'at') { d = empresas.filter(e => e.statusFechamento === 'EM ATRASO'); t = 'Empresas Em Atraso'; }
    setDrillData(d); setDrillTitle(t); setDrillCols(defaultCols);
  }

  function openDrillByField(field: keyof EmpresaRow, value: string) {
    const d = empresas.filter(e => String(e[field]) === value);
    setDrillData(d);
    setDrillTitle(`${value}: ${d.length} empresa(s)`);
    setDrillCols([
      { key: 'empresa', label: 'Empresa' }, { key: 'cnpj', label: 'CNPJ' },
      { key: 'codigo', label: 'Código' }, { key: field, label: String(field) },
      { key: 'statusFechamento', label: 'Status' }, { key: 'responsavel', label: 'Responsável' },
    ]);
  }

  const filteredHome = empresas.filter(e => {
    if (filterResp && e.responsavel !== filterResp) return false;
    if (filterStatus && e.statusFechamento !== filterStatus) return false;
    if (filterComp && e.competenciaFechamento !== filterComp) return false;
    if (filterMes) {
      const mesKey = `fech_${filterMes.replace('.', '_')}` as keyof EmpresaRow;
      if (!e[mesKey]) return false;
    }
    if (filterSearch && !e.empresa.toLowerCase().includes(filterSearch.toLowerCase())) return false;
    return true;
  });

  const compTableData = MESES.map(mes => {
    const key = `fech_${mes.replace('.', '_')}` as keyof EmpresaRow;
    const fechadas = empresas.filter(e => e[key]);
    const pendentes = empresas.length - fechadas.length;
    const dia = fechadas.filter(e => e.statusFechamento === 'EM DIA').length;
    const at = fechadas.filter(e => e.statusFechamento === 'EM ATRASO').length;
    const pct = fechadas.length ? Math.round((fechadas.length / empresas.length) * 100) : 0;
    return { mes, fechadas: fechadas.length, pendentes, dia, at, pct };
  });

  const compKColData = competencias.map(comp => {
    const rows = empresas.filter(e => e.competenciaFechamento === comp);
    const dia = rows.filter(e => e.statusFechamento === 'EM DIA').length;
    const at = rows.filter(e => e.statusFechamento === 'EM ATRASO').length;
    const pct = rows.length ? Math.round((rows.length / empresas.length) * 100) : 0;
    return { comp, total: rows.length, dia, at, pct };
  });

  async function gerarPDF() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    doc.setFillColor(13, 27, 42); doc.rect(0, 0, 210, 40, 'F');
    doc.setFillColor(217, 92, 18); doc.rect(0, 38, 210, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO EXECUTIVO', 14, 17);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal');
    doc.text('Departamento Contábil · Gestão Contadores', 14, 26);
    doc.setFontSize(9); doc.text(`Gerado em: ${now}`, 14, 34);

    doc.setTextColor(13, 27, 42);
    let y = 52;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text('RESUMO GERAL DE FECHAMENTOS', 14, y); y += 8;

    const kpis = [
      { label: 'Total de Empresas', value: String(total), color: [30, 64, 104] as [number,number,number] },
      { label: 'Em Dia', value: String(emDia), color: [21, 128, 61] as [number,number,number] },
      { label: 'Em Atraso', value: String(emAtraso), color: [220, 38, 38] as [number,number,number] },
      { label: '% Em Dia', value: `${percDia}%`, color: [217, 92, 18] as [number,number,number] },
    ];
    const cardW = 43;
    kpis.forEach((k, i) => {
      const x = 14 + i * (cardW + 3);
      doc.setFillColor(...k.color);
      doc.roundedRect(x, y, cardW, 22, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.text(k.label.toUpperCase(), x + 3, y + 7);
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.text(k.value, x + 3, y + 18);
    });
    y += 32;

    doc.setTextColor(13, 27, 42);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text('FECHAMENTOS POR COMPETÊNCIA (MÊS)', 14, y); y += 6;
    doc.setFillColor(238, 241, 246); doc.rect(14, y, 182, 8, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(13, 27, 42);
    ['Competência', 'Fechadas', 'Pendentes', 'Em Dia', 'Em Atraso', '% Fechado'].forEach((h, i) => {
      doc.text(h, 14 + i * 30, y + 5.5);
    });
    y += 10;
    compTableData.forEach((row, idx) => {
      if (idx % 2 === 1) { doc.setFillColor(248, 250, 252); doc.rect(14, y - 1, 182, 8, 'F'); }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(13, 27, 42);
      [row.mes, String(row.fechadas), String(row.pendentes), String(row.dia), String(row.at), `${row.pct}%`].forEach((v, i) => {
        doc.text(v, 14 + i * 30, y + 5);
      });
      y += 8;
    });

    y += 8;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text('COMPETÊNCIA DE FECHAMENTO (COLUNA K)', 14, y); y += 6;
    doc.setFillColor(238, 241, 246); doc.rect(14, y, 182, 8, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    ['Competência', 'Total', 'Em Dia', 'Em Atraso', '% do Total'].forEach((h, i) => {
      doc.text(h, 14 + i * 36, y + 5.5);
    });
    y += 10;
    compKColData.forEach((row, idx) => {
      if (idx % 2 === 1) { doc.setFillColor(248, 250, 252); doc.rect(14, y - 1, 182, 8, 'F'); }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(13, 27, 42);
      [row.comp, String(row.total), String(row.dia), String(row.at), `${row.pct}%`].forEach((v, i) => {
        doc.text(v, 14 + i * 36, y + 5);
      });
      y += 8;
    });

    y = 277;
    doc.setFillColor(13, 27, 42); doc.rect(0, y, 210, 20, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.text('Gestão Contadores · Departamento Contábil · Uso Exclusivo Interno', 105, y + 8, { align: 'center' });
    doc.text(`Página 1 de 1 · ${now}`, 105, y + 14, { align: 'center' });
    doc.save(`relatorio-fechamentos-${now.replace(/\//g, '-')}.pdf`);
  }

  const NavBtn = ({ id, label }: { id: NavSection; label: string }) => (
    <button className={`nav-btn${section === id ? ' active' : ''}`} onClick={() => setSection(id)}>{label}</button>
  );

  const sectionProps: SectionProps = {
    empresas, responsaveis, openDrill, openDrillByField, setDrillData, setDrillTitle, setDrillCols,
  };

  return (
    <div className="dashboard">
      {drillData && (
        <DrillModal title={drillTitle} data={drillData} columns={drillCols} onClose={() => setDrillData(null)} />
      )}

      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-circle">G</div>
          <div className="topbar-title">
            DASHBOARD DEPARTAMENTO CONTÁBIL
            <span>GESTÃO CONTADORES · {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <button className="btn-obrig" onClick={() => setSection('obrig')}>
          📋 OBRIGAÇÕES ACESSÓRIAS &amp; IMPLEMENTAÇÕES
        </button>
      </div>

      {/* NAV */}
      <nav className="nav-bar">
        <NavBtn id="home" label="🏠 Início" />
        <NavBtn id="empresas" label="🏢 Empresas" />
        <NavBtn id="integ" label="🔗 Integração Financeira" />
        <NavBtn id="regime" label="📊 Regime Tributário" />
        <NavBtn id="ativ" label="⚙️ Atividade Operacional" />
        <NavBtn id="folha" label="👥 Folha de Pagamento" />
        <NavBtn id="status" label="✅ Status de Fechamento" />
        <NavBtn id="comp" label="📅 Competência de Fechamento" />
        <NavBtn id="fecm" label="📆 Fechamentos em Mês" />
      </nav>

      {/* MAIN */}
      <main className="main-content">

        {/* HOME */}
        {section === 'home' && (
          <div className="fade-in">
            <div className="section-title">Visão Geral · Departamento Contábil</div>
            <div className="section-sub">
              Controle de fechamentos — {total} empresas
              {responsaveis.map(r => ` · ${r}: ${empresas.filter(e => e.responsavel === r).length}`).join('')}
            </div>
            <div className="kpi-row">
              <div className="kpi-card blue" onClick={() => openDrill('all')}>
                <div className="kpi-label">Total de Empresas</div>
                <div className="kpi-value">{total}</div>
                <div className="kpi-sub">clique para detalhar</div>
                <div className="kpi-icon">🏢</div>
              </div>
              <div className="kpi-card green" onClick={() => openDrill('dia')}>
                <div className="kpi-label">Em Dia</div>
                <div className="kpi-value" style={{ color: GREEN }}>{emDia}</div>
                <div className="kpi-sub">clique para detalhar</div>
                <div className="kpi-icon">✅</div>
              </div>
              <div className="kpi-card red" onClick={() => openDrill('at')}>
                <div className="kpi-label">Em Atraso</div>
                <div className="kpi-value" style={{ color: RED }}>{emAtraso}</div>
                <div className="kpi-sub">clique para detalhar</div>
                <div className="kpi-icon">⚠️</div>
              </div>
              <div className="kpi-card orange">
                <div className="kpi-label">% Em Dia</div>
                <div className="kpi-value" style={{ color: ORANGE }}>{percDia}%</div>
                <div className="kpi-sub">taxa de conformidade</div>
                <div className="kpi-icon">📈</div>
              </div>
            </div>

            <div className="panel-row">
              <div className="comp-card">
                <div className="comp-card-header">
                  <h3>📆 Fechamentos por Competência (Mês de Fechamento)</h3>
                  <p>Quantas empresas possuem o fechamento registrado em cada mês</p>
                </div>
                <table className="comp-table">
                  <thead>
                    <tr><th>Competência</th><th>Fechadas</th><th>Pendentes</th><th>Em Dia</th><th>Em Atraso</th><th>% Fechado</th><th>Progresso</th></tr>
                  </thead>
                  <tbody>
                    {compTableData.map(row => (
                      <tr key={row.mes}>
                        <td className="bold">{row.mes}</td>
                        <td className="center">
                          <button className="link-btn" onClick={() => {
                            const key = `fech_${row.mes.replace('.', '_')}` as keyof EmpresaRow;
                            setDrillData(empresas.filter(e => e[key]));
                            setDrillTitle(`Fechadas em ${row.mes}: ${row.fechadas}`);
                            setDrillCols([
                              { key: 'empresa', label: 'Empresa' }, { key: 'cnpj', label: 'CNPJ' },
                              { key: 'responsavel', label: 'Responsável' },
                              { key: 'competenciaFechamento', label: 'Competência' },
                              { key: 'statusFechamento', label: 'Status' },
                            ]);
                          }}>{row.fechadas}</button>
                        </td>
                        <td className="center muted">{row.pendentes}</td>
                        <td className="center"><span className="badge-green">{row.dia}</span></td>
                        <td className="center"><span className="badge-red">{row.at}</span></td>
                        <td className="center bold">{row.pct}%</td>
                        <td style={{ minWidth: 100 }}>
                          <div className="progress-wrap">
                            <div className="progress-bar" style={{ width: `${row.pct}%`, background: row.pct > 70 ? GREEN : row.pct > 40 ? YELLOW : RED }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="comp-card">
                <div className="comp-card-header">
                  <h3>📅 Competência de Fechamento (Coluna K)</h3>
                  <p>Distribuição pela competência do balancete atualizado</p>
                </div>
                <table className="comp-table">
                  <thead>
                    <tr><th>Competência</th><th>Total</th><th>Em Dia</th><th>Em Atraso</th><th>% Total</th><th>Progresso</th></tr>
                  </thead>
                  <tbody>
                    {compKColData.map(row => (
                      <tr key={row.comp}>
                        <td className="bold">{row.comp}</td>
                        <td className="center">
                          <button className="link-btn" onClick={() => {
                            setDrillData(empresas.filter(e => e.competenciaFechamento === row.comp));
                            setDrillTitle(`Competência ${row.comp}: ${row.total} empresa(s)`);
                            setDrillCols([
                              { key: 'empresa', label: 'Empresa' }, { key: 'cnpj', label: 'CNPJ' },
                              { key: 'responsavel', label: 'Responsável' },
                              { key: 'competenciaFechamento', label: 'Competência' },
                              { key: 'statusFechamento', label: 'Status' },
                            ]);
                          }}>{row.total}</button>
                        </td>
                        <td className="center"><span className="badge-green">{row.dia}</span></td>
                        <td className="center"><span className="badge-red">{row.at}</span></td>
                        <td className="center bold">{row.pct}%</td>
                        <td style={{ minWidth: 100 }}>
                          <div className="progress-wrap">
                            <div className="progress-bar" style={{ width: `${row.pct}%`, background: ORANGE }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <span>📋 Fechamentos por Empresa</span>
                <div className="table-filters">
                  <select className="filter-select-dark" value={filterResp} onChange={e => setFilterResp(e.target.value)}>
                    <option value="">Todos os Responsáveis</option>
                    {responsaveis.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <select className="filter-select-dark" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Todos os Status</option>
                    <option>EM DIA</option><option>EM ATRASO</option>
                  </select>
                  <select className="filter-select-dark" value={filterComp} onChange={e => setFilterComp(e.target.value)}>
                    <option value="">Todas as Competências</option>
                    {competencias.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select className="filter-select-dark" value={filterMes} onChange={e => setFilterMes(e.target.value)}>
                    <option value="">Todos os Meses</option>
                    {MESES.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <input className="filter-input" placeholder="Buscar..." value={filterSearch} onChange={e => setFilterSearch(e.target.value)} />
                </div>
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Empresa</th><th>CNPJ</th><th>Resp.</th><th>Competência</th>
                      {MESES.map(m => <th key={m}>{m}</th>)}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHome.map((row, i) => (
                      <tr key={i}>
                        <td className="bold">{row.empresa}</td>
                        <td className="mono">{row.cnpj}</td>
                        <td>{row.responsavel}</td>
                        <td>{row.competenciaFechamento || '–'}</td>
                        <td className="center"><CheckMark val={row.fech_10_2025} /></td>
                        <td className="center"><CheckMark val={row.fech_11_2025} /></td>
                        <td className="center"><CheckMark val={row.fech_12_2025} /></td>
                        <td className="center"><CheckMark val={row.fech_01_2026} /></td>
                        <td className="center"><CheckMark val={row.fech_02_2026} /></td>
                        <td><StatusBadge status={row.statusFechamento} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">{filteredHome.length} de {total} registros</div>
            </div>

            <div className="report-bar">
              <div>
                <strong>📄 Relatório Executivo para a Diretoria</strong>
                <p>Competência de fechamento, fechamentos por mês e status · PDF profissional</p>
              </div>
              <button className="btn-pdf" onClick={gerarPDF}>📄 Gerar PDF · Diretoria</button>
            </div>

            <div className="upload-zone">
              <h4>🔄 Atualizar Base de Dados</h4>
              <p>
                A base carrega automaticamente do Google Sheets a cada abertura. Para forçar atualização, clique em <strong>Reconectar</strong>.<br />
                Também é possível subir um arquivo <code>.csv</code> exportado da planilha.<br />
                <strong>Dica de automação:</strong> Publique a planilha como CSV em <em>Arquivo → Compartilhar → Publicar na web → CSV</em> — o link já está configurado abaixo. Basta clicar em Reconectar sempre que quiser atualizar.
              </p>
              <div className="upload-actions">
                <label className="btn-upload">
                  📂 Carregar CSV
                  <input ref={fileRef} type="file" accept=".csv,.xlsx" style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                </label>
                <input className="url-input" placeholder="Link CSV Google Sheets…" value={csvUrl} onChange={e => setCsvUrl(e.target.value)} />
                <button className="btn-upload" onClick={() => csvUrl && loadFromURL(csvUrl)} disabled={loading}>
                  {loading ? '⏳ Carregando...' : '🔄 Reconectar'}
                </button>
              </div>
              {loading && <p className="update-info" style={{ color: '#d97706' }}>⏳ Buscando dados da planilha…</p>}
              {error && <p className="update-info" style={{ color: '#dc2626' }}>❌ {error}</p>}
              {lastUpdate && !loading && !error && (
                <p className="update-info">✅ Base carregada do Google Sheets: {lastUpdate.toLocaleString('pt-BR')} · {data.empresas.length} empresas</p>
              )}
            </div>
          </div>
        )}

        {section === 'empresas' && <EmpresasSection {...sectionProps} />}

        {section === 'integ' && (
          <GenericSection {...sectionProps} title="🔗 Integração Financeira" subtitle="Distribuição por sistema de integração"
            field="integracaoFinanceira" label="Empresas por Integração Financeira"
            rows={empresas} extraCols={[{ key: 'integracaoFinanceira', label: 'Integração Financeira' }]} />
        )}

        {section === 'regime' && <RegimeSection {...sectionProps} />}

        {section === 'ativ' && (
          <GenericSection {...sectionProps} title="⚙️ Atividade Operacional" subtitle="Distribuição por atividade"
            field="atividadeOperacional" label="Empresas por Atividade Operacional"
            rows={empresas} extraCols={[{ key: 'atividadeOperacional', label: 'Atividade Operacional' }]} />
        )}

        {section === 'folha' && <FolhaSection {...sectionProps} />}
        {section === 'status' && <StatusSection {...sectionProps} />}
        {section === 'comp' && <CompSection {...sectionProps} />}
        {section === 'fecm' && <FecmSection {...sectionProps} />}

        {section === 'obrig' && (
          <div className="fade-in">
            <div className="section-title">📋 Obrigações Acessórias &amp; Implementações</div>
            <div className="section-sub">ECD/ECF · ReINF · Implementações</div>
            <div className="obrig-tabs">
              {([['ecd', '📑 ECD e ECF 2025'], ['reinf', '🔄 ReINF 2025'], ['impl', '⚙️ Implementações']] as [ObrigTab, string][]).map(([id, label]) => (
                <button key={id} className={`obrig-tab${obrigTab === id ? ' active' : ''}`} onClick={() => setObrigTab(id)}>{label}</button>
              ))}
            </div>
            {obrigTab === 'ecd' && <EcdTab ecdEcf={data.ecdEcf} />}
            {obrigTab === 'reinf' && <ReinfTab reinf={data.reinf} />}
            {obrigTab === 'impl' && <ImplTab implementacoes={data.implementacoes} />}
          </div>
        )}

      </main>
    </div>
  );
}
