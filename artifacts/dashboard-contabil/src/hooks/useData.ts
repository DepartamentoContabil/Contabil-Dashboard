import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import type { EmpresaRow, EcdEcfRow, ReinfRow, ImplementacaoRow } from '@/data/sampleData';
import {
  SAMPLE_EMPRESAS,
  SAMPLE_ECD_ECF,
  SAMPLE_REINF,
  SAMPLE_IMPLEMENTACOES,
} from '@/data/sampleData';

export interface AppData {
  empresas: EmpresaRow[];
  ecdEcf: EcdEcfRow[];
  reinf: ReinfRow[];
  implementacoes: ImplementacaoRow[];
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

  const loadFromCSV = useCallback((text: string) => {
    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });
    if (!result.data.length) return;

    const rows: EmpresaRow[] = result.data.map((r) => ({
      cnpj: r['CNPJ'] || r['cnpj'] || '',
      empresa: r['EMPRESA'] || r['empresa'] || r['EMPRESAS'] || '',
      codigo: r['CÓDIGO SISTEMA'] || r['codigo'] || r['COD'] || '',
      integracaoFinanceira: r['INTEGRAÇÃO FINANCEIRA'] || r['TIPO DE INTEGRAÇÃO FINANCEIRA'] || '',
      atividadeOperacional: r['ATIVIDADE OPERACIONAL'] || '',
      regimeTributario: r['REGIME TRIBUTÁRIO'] || '',
      folhaPagamento: r['INFORMAÇÃO DE FOLHA DE PAGAMENTO'] || r['FOLHA'] || '',
      responsavel: r['RESPONSÁVEL'] || r['RESPONSAVEL'] || '',
      statusFechamento: r['STATUS DE FECHAMENTO'] || r['STATUS FECHAMENTO'] || '',
      competenciaFechamento: r['COMPETÊNCIA DE FECHAMENTO'] || r['COMPETENCIA'] || '',
      fech_10_2025: r['FECHAMENTOS EM 10.2025'] || r['10.2025'] || '',
      fech_11_2025: r['FECHAMENTOS EM 11.2025'] || r['11.2025'] || '',
      fech_12_2025: r['FECHAMENTOS EM 12.2025'] || r['12.2025'] || '',
      fech_01_2026: r['FECHAMENTOS EM 01.2026'] || r['01.2026'] || '',
      fech_02_2026: r['FECHAMENTOS EM 02.2026'] || r['02.2026'] || '',
    }));

    setData((prev) => ({ ...prev, empresas: rows }));
    setLastUpdate(new Date());
  }, []);

  const loadFromURL = useCallback(async (url: string) => {
    setLoading(true);
    try {
      let finalUrl = url;
      if (url.includes('docs.google.com/spreadsheets')) {
        const match = url.match(/\/d\/([^/]+)/);
        if (match) {
          finalUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
        }
      }
      const res = await fetch(finalUrl);
      const text = await res.text();
      loadFromCSV(text);
    } catch (e) {
      console.error('Erro ao carregar CSV:', e);
    } finally {
      setLoading(false);
    }
  }, [loadFromCSV]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        loadFromCSV(e.target.result as string);
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, [loadFromCSV]);

  return { data, loading, lastUpdate, loadFromURL, handleFileUpload };
}
