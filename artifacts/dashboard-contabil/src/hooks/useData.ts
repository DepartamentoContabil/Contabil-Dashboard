import { useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import type { EmpresaRow, EcdEcfRow, ReinfRow, ImplementacaoRow } from '@/data/sampleData';
import {
  SAMPLE_EMPRESAS,
  SAMPLE_ECD_ECF,
  SAMPLE_REINF,
  SAMPLE_IMPLEMENTACOES,
} from '@/data/sampleData';

export const DEFAULT_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4SRwt-4cFsO1Tw7LSWvsKkB_8yHn1pxe0WECb1GniFGKFKHSItlxQ9fAl2T73tA_6pJuFElOx_OFv/pub?output=csv';

export interface AppData {
  empresas: EmpresaRow[];
  ecdEcf: EcdEcfRow[];
  reinf: ReinfRow[];
  implementacoes: ImplementacaoRow[];
}

function normalizeDate(val: string): string {
  if (!val) return '';
  const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[2]}.${m[3]}`;
  return val;
}

function parseEmpresaRow(r: Record<string, string>): EmpresaRow {
  const keys = Object.keys(r);

  const get = (...searchKeys: string[]): string => {
    for (const k of searchKeys) {
      const found = keys.find(rk => rk.trim().toUpperCase().replace(/\s+/g, ' ') === k.trim().toUpperCase().replace(/\s+/g, ' '));
      if (found && r[found]?.trim()) return r[found].trim();
    }
    for (const k of searchKeys) {
      const found = keys.find(rk => rk.trim().toUpperCase().includes(k.trim().toUpperCase()));
      if (found && r[found]?.trim()) return r[found].trim();
    }
    return '';
  };

  const fechGet = (...searchKeys: string[]): string => {
    const v = get(...searchKeys);
    return v ? 'X' : '';
  };

  const comp = normalizeDate(get(
    'COMPETÊNCIA DE FECHAMENTO', 'COMPETENCIA DE FECHAMENTO', 'COMPETÊNCIA', 'COMPETENCIA'
  ));

  return {
    cnpj: get('CNPJ'),
    empresa: get('EMPRESAS', 'EMPRESA'),
    codigo: get('CÓDIGO SISTEMA', 'CODIGO SISTEMA', 'COD', 'CÓDIGO'),
    integracaoFinanceira: get(
      'INTEGRAÇÃO FINANCEIRA', 'INTEGRACAO FINANCEIRA',
      'TIPO DE INTEGRAÇÃO FINANCEIRA', 'TIPO DE INTEGRACAO FINANCEIRA'
    ),
    atividadeOperacional: get('ATIVIDADE OPERACIONAL'),
    regimeTributario: get('REGIME TRIBUTÁRIO', 'REGIME TRIBUTARIO'),
    folhaPagamento: get(
      'INFORMAÇÃO DE FOLHA DE PAGAMENTO', 'INFORMACAO DE FOLHA DE PAGAMENTO',
      'INFORMAÇÃO FOLHA', 'FOLHA'
    ),
    responsavel: get('RESPONSÁVEL', 'RESPONSAVEL'),
    statusFechamento: get('STATUS DE FECHAMENTO', 'STATUS FECHAMENTO', 'STATUS'),
    competenciaFechamento: comp,
    fech_10_2025: fechGet('FECHAMENTOS EM 10.2025', '10.2025'),
    fech_11_2025: fechGet('FECHAMENTOS EM 11.2025', '11.2025'),
    fech_12_2025: fechGet('FECHAMENTOS EM 12.2025', '12.2025'),
    fech_01_2026: fechGet('FECHAMENTOS EM 01.2026', '01.2026'),
    fech_02_2026: fechGet('FECHAMENTOS EM 02.2026', '02.2026'),
  };
}

export function useData() {
  const [data, setData] = useState<AppData>({
    empresas: SAMPLE_EMPRESAS,
    ecdEcf: SAMPLE_ECD_ECF,
    reinf: SAMPLE_REINF,
    implementacoes: SAMPLE_IMPLEMENTACOES,
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFromCSVText = useCallback((text: string) => {
    let csvText = text;

    const lines = text.split('\n');
    const headerLineIdx = lines.findIndex(line => {
      const upper = line.toUpperCase();
      return upper.includes('CNPJ') || upper.includes('EMPRESAS') || upper.includes('EMPRESA');
    });
    if (headerLineIdx > 0) {
      csvText = lines.slice(headerLineIdx).join('\n');
    }

    const result = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    if (!result.data.length) return;

    const rows: EmpresaRow[] = result.data
      .map(parseEmpresaRow)
      .filter(r => r.empresa || r.cnpj);

    if (rows.length > 0) {
      setData(prev => ({ ...prev, empresas: rows }));
      setLastUpdate(new Date());
      setError(null);
    }
  }, []);

  const loadFromURL = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const proxyUrl = `/api/csv-proxy?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const text = await res.text();
      loadFromCSVText(text);
    } catch (e: any) {
      console.error('Erro ao carregar CSV:', e);
      setError(`Erro ao carregar planilha: ${e?.message || 'verifique o link'}`);
    } finally {
      setLoading(false);
    }
  }, [loadFromCSVText]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        loadFromCSVText(e.target.result as string);
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, [loadFromCSVText]);

  useEffect(() => {
    loadFromURL(DEFAULT_CSV_URL);
  }, []);

  return { data, loading, lastUpdate, error, loadFromURL, handleFileUpload };
}
