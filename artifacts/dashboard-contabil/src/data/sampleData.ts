export interface EmpresaRow {
  cnpj: string;
  empresa: string;
  codigo: string;
  integracaoFinanceira: string;
  atividadeOperacional: string;
  regimeTributario: string;
  folhaPagamento: string;
  responsavel: string;
  statusFechamento: string;
  competenciaFechamento: string;
  fech_10_2025: string;
  fech_11_2025: string;
  fech_12_2025: string;
  fech_01_2026: string;
  fech_02_2026: string;
}

export interface EcdEcfRow {
  cnpj: string;
  empresa: string;
  codigo: string;
  responsavel: string;
  ecd: string;
  ecf: string;
}

export interface ReinfRow {
  cnpj: string;
  empresa: string;
  codigo: string;
  responsavel: string;
  t1: string;
  t2: string;
  t3: string;
  t4: string;
}

export interface ImplementacaoRow {
  cnpj: string;
  empresa: string;
  codigo: string;
  responsavel: string;
  onvio: string;
  nibo: string;
  fiscalFolha: string;
}

export const MESES = ['10.2025','11.2025','12.2025','01.2026','02.2026'];

export const SAMPLE_EMPRESAS: EmpresaRow[] = [
  { cnpj:'00.112.233/0001-44', empresa:'ABRE CAMINHO LTDA', codigo:'1001', integracaoFinanceira:'CAIXA', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'FOLHA', responsavel:'INGRID', statusFechamento:'EM DIA', competenciaFechamento:'01.2026', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'X', fech_02_2026:'X' },
  { cnpj:'00.223.344/0001-55', empresa:'ALDEMIR CANDIDO ME', codigo:'1002', integracaoFinanceira:'BANCO', atividadeOperacional:'SERVIÇO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'PRO LABORE', responsavel:'INGRID', statusFechamento:'EM DIA', competenciaFechamento:'01.2026', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'X', fech_02_2026:'' },
  { cnpj:'01.234.567/0001-01', empresa:'ALFA SOLUÇÕES EIRELI', codigo:'1003', integracaoFinanceira:'NIBO', atividadeOperacional:'SERVIÇO', regimeTributario:'LUCRO PRESUMIDO', folhaPagamento:'FOLHA', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'10.2025', fech_10_2025:'X', fech_11_2025:'', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'02.345.678/0001-02', empresa:'ALTO MAR COMERCIAL LTDA', codigo:'1004', integracaoFinanceira:'ACOMPANHAR', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'11.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'03.456.789/0001-03', empresa:'AMAZON TECH SERVIÇOS', codigo:'1005', integracaoFinanceira:'8SYS', atividadeOperacional:'SERVIÇO/COMÉRCIO', regimeTributario:'LUCRO PRESUMIDO', folhaPagamento:'FOLHA', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'12.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'04.567.890/0001-04', empresa:'ANDRADE & MELO LTDA', codigo:'1006', integracaoFinanceira:'CAIXA', atividadeOperacional:'SERVIÇO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'FATOR R', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'10.2025', fech_10_2025:'X', fech_11_2025:'', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'05.678.901/0001-05', empresa:'APEX CONSULTORIA', codigo:'1007', integracaoFinanceira:'BANCO', atividadeOperacional:'SERVIÇO', regimeTributario:'LUCRO REAL', folhaPagamento:'FOLHA', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'11.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'06.789.012/0001-06', empresa:'ARCO ÍRIS DISTRIBUIDORA', codigo:'1008', integracaoFinanceira:'BPO', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'KELVIN', statusFechamento:'EM DIA', competenciaFechamento:'01.2026', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'X', fech_02_2026:'' },
  { cnpj:'07.890.123/0001-07', empresa:'ARGO EMPREENDIMENTOS', codigo:'1009', integracaoFinanceira:'VOXEL', atividadeOperacional:'HOLDING', regimeTributario:'LUCRO PRESUMIDO', folhaPagamento:'PRO LABORE', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'12.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'08.901.234/0001-08', empresa:'AROMA CAFÉ EIRELI', codigo:'1010', integracaoFinanceira:'CARNÊ LEÃO', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'10.2025', fech_10_2025:'X', fech_11_2025:'', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'09.012.345/0001-09', empresa:'ARTE E FORMA LTDA', codigo:'1011', integracaoFinanceira:'CAIXA', atividadeOperacional:'SERVIÇO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'FOLHA', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'11.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'10.123.456/0001-10', empresa:'ARTESANATO BRASIL', codigo:'1012', integracaoFinanceira:'BANCO', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'KELVIN', statusFechamento:'EM DIA', competenciaFechamento:'01.2026', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'X', fech_02_2026:'X' },
  { cnpj:'11.234.567/0001-11', empresa:'ATLAS TECNOLOGIA LTDA', codigo:'1013', integracaoFinanceira:'NIBO', atividadeOperacional:'SERVIÇO', regimeTributario:'LUCRO PRESUMIDO', folhaPagamento:'FOLHA', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'12.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'12.345.678/0001-12', empresa:'AURORA SERVIÇOS', codigo:'1014', integracaoFinanceira:'ACOMPANHAR', atividadeOperacional:'SERVIÇO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'PRO LABORE', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'10.2025', fech_10_2025:'X', fech_11_2025:'', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'13.456.789/0001-13', empresa:'AZUL COMÉRCIO LTDA', codigo:'1015', integracaoFinanceira:'8SYS', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'INGRID', statusFechamento:'EM DIA', competenciaFechamento:'01.2026', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'X', fech_02_2026:'' },
  { cnpj:'14.567.890/0001-14', empresa:'BELLA VITA EIRELI', codigo:'1016', integracaoFinanceira:'CAIXA', atividadeOperacional:'SERVIÇO/COMÉRCIO', regimeTributario:'LUCRO PRESUMIDO', folhaPagamento:'FOLHA', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'11.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'15.678.901/0001-15', empresa:'BOA VISTA AGRO LTDA', codigo:'1017', integracaoFinanceira:'BANCO', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'FATOR R', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'12.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'16.789.012/0001-16', empresa:'BRAVO SOLUCOES LTDA', codigo:'1018', integracaoFinanceira:'BPO', atividadeOperacional:'SERVIÇO', regimeTributario:'LUCRO REAL', folhaPagamento:'FOLHA', responsavel:'KELVIN', statusFechamento:'EM DIA', competenciaFechamento:'01.2026', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'X', fech_02_2026:'X' },
  { cnpj:'17.890.123/0001-17', empresa:'BRILHO DO SUL LTDA', codigo:'1019', integracaoFinanceira:'VOXEL', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'10.2025', fech_10_2025:'X', fech_11_2025:'', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'18.901.234/0001-18', empresa:'CAMPO VERDE AGRO', codigo:'1020', integracaoFinanceira:'CARNÊ LEÃO', atividadeOperacional:'COMÉRCIO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'PRO LABORE', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'11.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'19.012.345/0001-19', empresa:'CAPITAL GESTÃO LTDA', codigo:'1021', integracaoFinanceira:'NIBO', atividadeOperacional:'HOLDING', regimeTributario:'LUCRO PRESUMIDO', folhaPagamento:'FOLHA', responsavel:'INGRID', statusFechamento:'EM ATRASO', competenciaFechamento:'12.2025', fech_10_2025:'X', fech_11_2025:'X', fech_12_2025:'X', fech_01_2026:'', fech_02_2026:'' },
  { cnpj:'20.123.456/0001-20', empresa:'CASA DO ENGENHEIRO', codigo:'1022', integracaoFinanceira:'ACOMPANHAR', atividadeOperacional:'SERVIÇO', regimeTributario:'SIMPLES NACIONAL', folhaPagamento:'SEM FOLHA', responsavel:'KELVIN', statusFechamento:'EM ATRASO', competenciaFechamento:'10.2025', fech_10_2025:'X', fech_11_2025:'', fech_12_2025:'', fech_01_2026:'', fech_02_2026:'' },
];

export const SAMPLE_ECD_ECF: EcdEcfRow[] = [
  { cnpj:'00.112.233/0001-44', empresa:'ABRE CAMINHO LTDA', codigo:'1001', responsavel:'INGRID', ecd:'ENVIADA', ecf:'ENVIADA' },
  { cnpj:'00.223.344/0001-55', empresa:'ALDEMIR CANDIDO ME', codigo:'1002', responsavel:'INGRID', ecd:'PENDENTE', ecf:'PENDENTE' },
  { cnpj:'01.234.567/0001-01', empresa:'ALFA SOLUÇÕES EIRELI', codigo:'1003', responsavel:'KELVIN', ecd:'SEM MOVIMENTO', ecf:'SEM MOVIMENTO' },
  { cnpj:'02.345.678/0001-02', empresa:'ALTO MAR COMERCIAL LTDA', codigo:'1004', responsavel:'KELVIN', ecd:'NÃO OBRIGADA', ecf:'NÃO OBRIGADA' },
  { cnpj:'03.456.789/0001-03', empresa:'AMAZON TECH SERVIÇOS', codigo:'1005', responsavel:'INGRID', ecd:'ENVIADA', ecf:'PENDENTE' },
  { cnpj:'04.567.890/0001-04', empresa:'ANDRADE & MELO LTDA', codigo:'1006', responsavel:'KELVIN', ecd:'PENDENTE', ecf:'PENDENTE' },
  { cnpj:'05.678.901/0001-05', empresa:'APEX CONSULTORIA', codigo:'1007', responsavel:'INGRID', ecd:'ENVIADA', ecf:'ENVIADA' },
  { cnpj:'06.789.012/0001-06', empresa:'ARCO ÍRIS DISTRIBUIDORA', codigo:'1008', responsavel:'KELVIN', ecd:'NÃO OBRIGADA', ecf:'NÃO OBRIGADA' },
  { cnpj:'07.890.123/0001-07', empresa:'ARGO EMPREENDIMENTOS', codigo:'1009', responsavel:'INGRID', ecd:'ENVIADA', ecf:'ENVIADA' },
  { cnpj:'08.901.234/0001-08', empresa:'AROMA CAFÉ EIRELI', codigo:'1010', responsavel:'KELVIN', ecd:'SEM MOVIMENTO', ecf:'SEM MOVIMENTO' },
];

export const SAMPLE_REINF: ReinfRow[] = [
  { cnpj:'00.112.233/0001-44', empresa:'ABRE CAMINHO LTDA', codigo:'1001', responsavel:'INGRID', t1:'SIM', t2:'SIM', t3:'SIM', t4:'SIM' },
  { cnpj:'00.223.344/0001-55', empresa:'ALDEMIR CANDIDO ME', codigo:'1002', responsavel:'INGRID', t1:'SIM', t2:'SIM', t3:'NÃO', t4:'NÃO' },
  { cnpj:'01.234.567/0001-01', empresa:'ALFA SOLUÇÕES EIRELI', codigo:'1003', responsavel:'KELVIN', t1:'NÃO', t2:'NÃO', t3:'NÃO', t4:'NÃO' },
  { cnpj:'02.345.678/0001-02', empresa:'ALTO MAR COMERCIAL LTDA', codigo:'1004', responsavel:'KELVIN', t1:'SIM', t2:'NÃO', t3:'NÃO', t4:'NÃO' },
  { cnpj:'03.456.789/0001-03', empresa:'AMAZON TECH SERVIÇOS', codigo:'1005', responsavel:'INGRID', t1:'SIM', t2:'SIM', t3:'SIM', t4:'NÃO' },
  { cnpj:'04.567.890/0001-04', empresa:'ANDRADE & MELO LTDA', codigo:'1006', responsavel:'KELVIN', t1:'NÃO', t2:'NÃO', t3:'NÃO', t4:'NÃO' },
  { cnpj:'05.678.901/0001-05', empresa:'APEX CONSULTORIA', codigo:'1007', responsavel:'INGRID', t1:'SIM', t2:'SIM', t3:'SIM', t4:'SIM' },
  { cnpj:'06.789.012/0001-06', empresa:'ARCO ÍRIS DISTRIBUIDORA', codigo:'1008', responsavel:'KELVIN', t1:'NÃO', t2:'NÃO', t3:'NÃO', t4:'NÃO' },
];

export const SAMPLE_IMPLEMENTACOES: ImplementacaoRow[] = [
  { cnpj:'00.112.233/0001-44', empresa:'ABRE CAMINHO LTDA', codigo:'1001', responsavel:'INGRID', onvio:'SIM', nibo:'NÃO', fiscalFolha:'SIM' },
  { cnpj:'00.223.344/0001-55', empresa:'ALDEMIR CANDIDO ME', codigo:'1002', responsavel:'INGRID', onvio:'NÃO', nibo:'SIM', fiscalFolha:'SIM' },
  { cnpj:'01.234.567/0001-01', empresa:'ALFA SOLUÇÕES EIRELI', codigo:'1003', responsavel:'KELVIN', onvio:'NÃO', nibo:'NÃO', fiscalFolha:'NÃO' },
  { cnpj:'02.345.678/0001-02', empresa:'ALTO MAR COMERCIAL LTDA', codigo:'1004', responsavel:'KELVIN', onvio:'SIM', nibo:'NÃO', fiscalFolha:'SIM' },
  { cnpj:'03.456.789/0001-03', empresa:'AMAZON TECH SERVIÇOS', codigo:'1005', responsavel:'INGRID', onvio:'SIM', nibo:'SIM', fiscalFolha:'SIM' },
  { cnpj:'04.567.890/0001-04', empresa:'ANDRADE & MELO LTDA', codigo:'1006', responsavel:'KELVIN', onvio:'NÃO', nibo:'NÃO', fiscalFolha:'NÃO' },
  { cnpj:'05.678.901/0001-05', empresa:'APEX CONSULTORIA', codigo:'1007', responsavel:'INGRID', onvio:'SIM', nibo:'SIM', fiscalFolha:'SIM' },
  { cnpj:'06.789.012/0001-06', empresa:'ARCO ÍRIS DISTRIBUIDORA', codigo:'1008', responsavel:'KELVIN', onvio:'SIM', nibo:'NÃO', fiscalFolha:'SIM' },
];
