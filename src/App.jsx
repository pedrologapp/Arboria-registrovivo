import { useState, useEffect } from "react";

const STORAGE_KEY = "arboria-registry-v4";

const COLORS = {
  bg: "#0a0f1a",
  surface: "#111827",
  surfaceHover: "#1a2332",
  surfaceActive: "#1e293b",
  border: "#1e293b",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  green: "#22c55e",
  greenBg: "#22c55e15",
  blue: "#3b82f6",
  blueBg: "#3b82f615",
  orange: "#f59e0b",
  orangeBg: "#f59e0b15",
  purple: "#8b5cf6",
  purpleBg: "#8b5cf615",
  red: "#ef4444",
  redBg: "#ef444415",
  pink: "#ec4899",
  pinkBg: "#ec489915",
  cyan: "#06b6d4",
  cyanBg: "#06b6d415",
};

const STATUS_OPTIONS = [
  { value: "exists", label: "✅ Existe", color: COLORS.green },
  { value: "update", label: "⚠️ Atualizar", color: COLORS.orange },
  { value: "create", label: "❌ Criar", color: COLORS.red },
  { value: "progress", label: "🔄 Em andamento", color: COLORS.blue },
  { value: "planned", label: "📋 Planejado", color: COLORS.textDim },
];

const IMS = ["Linguística", "Lógico-Matemática", "Espacial", "Musical", "Corporal", "Naturalista", "Interpessoal", "Intrapessoal"];

// Infantil uses "Mundos" not IMs
const MUNDOS_INFANTIL = [
  { nome: "Corpo", im: "Corporal-Cinestésica", pergunta: "O que meu corpo consegue fazer?" },
  { nome: "Som", im: "Musical", pergunta: "O que o som me diz?" },
  { nome: "Natureza", im: "Naturalista", pergunta: "O que está vivo ao meu redor?" },
  { nome: "Espaço", im: "Espacial", pergunta: "Como as coisas se encaixam?" },
  { nome: "Amigos", im: "Interpessoal", pergunta: "Quem são as pessoas ao meu redor?" },
  { nome: "Palavras", im: "Linguística", pergunta: "O que as palavras podem fazer?" },
  { nome: "Eu", im: "Intrapessoal", pergunta: "O que eu sinto por dentro?" },
  { nome: "Padrões", im: "Lógico-Matemática", pergunta: "Como as coisas funcionam?" },
];

// F1 uses "Superpoderes" (1-3) and "Talentos" (4-5) — same 8 phases, different names
const FASES_F1 = [
  { nome: "Corpo", im: "Corporal-Cinestésica" },
  { nome: "Som", im: "Musical" },
  { nome: "Espaço", im: "Espacial" },
  { nome: "Natureza", im: "Naturalista" },
  { nome: "Palavras", im: "Linguística" },
  { nome: "Números", im: "Lógico-Matemática" },
  { nome: "Pessoas", im: "Interpessoal" },
  { nome: "Eu", im: "Intrapessoal" },
];

// Segments with their characteristics
const SEGMENTS = {
  infantil: { label: "Infantil", sublabel: "Mundos de Descoberta", series: ["Maternal II", "Maternal III", "Grupo IV", "Grupo V"], semanas: ["Sentir", "Explorar", "Expressar", "Reconhecer"], hasCasas: false, phases: MUNDOS_INFANTIL },
  f1_super: { label: "1º-3º Ano", sublabel: "Jornada dos Superpoderes", series: ["1º Ano", "2º Ano", "3º Ano"], semanas: ["Apresentar", "Praticar", "Aplicar", "Desafio"], hasCasas: false, phases: FASES_F1 },
  f1_acad: { label: "4º-5º Ano", sublabel: "Academia de Talentos", series: ["4º Ano", "5º Ano"], semanas: ["Apresentar", "Praticar", "Aplicar", "Desafio"], hasCasas: false, phases: FASES_F1 },
  f2: { label: "6º-9º Ano", sublabel: "Sistema de Casas", series: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"], semanas: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], hasCasas: true, phases: IMS.map(im => ({ nome: im, im })) },
};

const initialCategories = [
  {
    id: "A",
    name: "Fundamentos Pedagógicos",
    emoji: "📚",
    color: COLORS.green,
    colorBg: COLORS.greenBg,
    description: "O 'porquê' do Arboria — a essência que não muda",
    docs: [
      { id: "01", name: "Manifesto Arboria (Completo)", status: "exists", notes: "Documento-mãe. Metáfora da árvore, SOCT 2.1, SCA 2.0, tríade pedagógica." },
      { id: "02", name: "Documento Mestre F1", status: "exists", notes: "Superpoderes, Academia de Talentos, 1º ao 5º ano." },
      { id: "03", name: "Documento Mestre Infantil", status: "exists", notes: "Adaptação para 3-6 anos." },
      { id: "04", name: "O Poder de Acreditar", status: "exists", notes: "Fundamentação psicológica e neurocientífica." },
      { id: "05", name: "Estudos de Caso Acreditar", status: "exists", notes: "Casos reais do sistema Acreditar." },
      { id: "06", name: "Arquétipos", status: "exists", notes: "Sistema de arquétipos do projeto." },
      { id: "06b", name: "Framework v2.0 — Mapa de Ativação", status: "exists", notes: "NOVO. 4 Pilares revisados (52 habilidades), 32 Subclasses, 3 Fontes de Observação, IA Analisadora, 6 Graus de Inferência, Algoritmo de Acumulação." },
    ],
  },
  {
    id: "B",
    name: "Dossiês das 8 Inteligências",
    emoji: "🧠",
    color: COLORS.blue,
    colorBg: COLORS.blueBg,
    description: "Um dossiê por IM — fundamentos, progressão, sinais, casa",
    docs: [
      { id: "07", name: "IM Linguística", status: "exists", notes: "Casa dos Narradores. Completo." },
      { id: "08", name: "IM Lógico-Matemática", status: "exists", notes: "Casa dos Decifradores. Completo." },
      { id: "09", name: "IM Espacial", status: "exists", notes: "Casa dos Criadores. Completo." },
      { id: "10", name: "IM Musical", status: "exists", notes: "Casa dos Músicos. Completo." },
      { id: "11", name: "IM Corporal-Cinestésica", status: "exists", notes: "Casa dos Atletas. Completo." },
      { id: "12", name: "IM Naturalista", status: "exists", notes: "Casa dos Exploradores. Completo." },
      { id: "13", name: "IM Interpessoal", status: "exists", notes: "Casa dos Conectores. Completo." },
      { id: "14", name: "IM Intrapessoal", status: "exists", notes: "Casa dos Pensadores. Completo." },
    ],
  },
  {
    id: "C",
    name: "Documentação Técnica do App",
    emoji: "⚙️",
    color: COLORS.orange,
    colorBg: COLORS.orangeBg,
    description: "Especificações do sistema digital — Lovable + Supabase + N8N",
    docs: [
      { id: "15", name: "Especificação Técnica do App", status: "update", notes: "Tipos de usuário, pontuação, missões, observações, banco, roadmap. PRECISA ATUALIZAR com estado real." },
      { id: "16", name: "Livro do Aluno — Especificação", status: "update", notes: "Livro vivo, narrador IA, webhooks, tabelas. PRECISA ATUALIZAR." },
      { id: "17", name: "Banco de Dados Atual (Snapshot)", status: "create", notes: "CRÍTICO. O Supabase tem 40+ tabelas reais — muito mais que as 8 documentadas na especificação. Precisa: snapshot completo de TODAS as tabelas, campos, RLS, triggers, functions. Isso é a maior lacuna documental do projeto." },
      { id: "18", name: "Changelog do App", status: "create", notes: "Log de mudanças: data, o que mudou, onde (Lovable/Supabase/N8N)." },
      { id: "19", name: "Bugs e Pendências", status: "create", notes: "Lista viva de bugs, comportamentos inesperados, coisas que faltam." },
      { id: "20", name: "Fluxos N8N", status: "create", notes: "Documentação dos workflows: quais existem, triggers, conexões." },
      { id: "20b", name: "Mapa das 52 Habilidades (Pilares)", status: "create", notes: "FRAMEWORK v2.0. Tabela completa: 15 Cognitivas + 11 Autorregulatórias + 13 Sociais + 13 Emocionais. Com núcleos de ativação por faixa etária." },
      { id: "20c", name: "32 Subclasses — Tabela Completa", status: "create", notes: "FRAMEWORK v2.0. 8 IMs × 4 Pilares = 32 subclasses. Com descrição, sinais observáveis, exemplos." },
      { id: "20d", name: "IA Analisadora — Especificação", status: "create", notes: "FRAMEWORK v2.0. Arquitetura da IA que analisa entregas: etiquetas pedagógicas, fluxo de análise, JSON de retorno, integração com Narrador." },
      { id: "20e", name: "Algoritmo de Acumulação — Especificação", status: "create", notes: "FRAMEWORK v2.0. 6 Graus de Inferência, pesos (Missão +1, Observação +1.5, Finalização +2, Convergência +3), regras de progressão." },
    ],
  },
  {
    id: "D",
    name: "Operacional & Professor",
    emoji: "📋",
    color: COLORS.purple,
    colorBg: COLORS.purpleBg,
    description: "Documentos de uso diário na escola",
    docs: [
      { id: "21", name: "Guia de Apuração do Professor", status: "exists", notes: "Tabela rápida, faixas de classificação, regras especiais." },
      { id: "22", name: "Dicionário de Observações", status: "exists", notes: "Dicionário expandido por inteligência." },
      { id: "23", name: "Dicionário de IAs", status: "exists", notes: "Referência rápida das inteligências." },
      { id: "24", name: "A Pergunta Mais Importante", status: "exists", notes: "Documento sobre a pergunta central do Arboria." },
      { id: "25", name: "Material 6º Ano Interpessoal (Exemplo)", status: "exists", notes: "Exemplo completo de material para uma série + fase." },
    ],
  },
  {
    id: "E",
    name: "Planos de Aula — Todas as Séries",
    emoji: "🎓",
    color: COLORS.pink,
    colorBg: COLORS.pinkBg,
    description: "Infantil (Mundos) + 1º-3º (Superpoderes) + 4º-5º (Talentos) + 6º-9º (Casas). Infantil e F1 NÃO têm casas — só fases e aulas.",
    docs: [],
  },
  {
    id: "F",
    name: "Missões Semanais — Todas as Séries",
    emoji: "🎯",
    color: COLORS.cyan,
    colorBg: COLORS.cyanBg,
    description: "Infantil e F1: missão única por fase (sem casas). F2: Missão do Projeto (todos) + Missão da Casa (8 versões por IM).",
    docs: [],
  },
];

function generateAulaDocs() {
  const docs = [];
  Object.entries(SEGMENTS).forEach(([segKey, seg]) => {
    seg.series.forEach((serie) => {
      seg.phases.forEach((phase) => {
        const cleanSerie = serie.replace(/\s|º|-/g, "");
        const cleanPhase = phase.nome.replace(/[^a-zA-Z]/g, "").substring(0, 5);
        const id = `E-${cleanSerie}-${cleanPhase}`;
        const isExisting = (serie === "6º Ano" && phase.nome === "Interpessoal") || (serie === "6º Ano" && phase.im === "Interpessoal");
        const semanaNames = seg.semanas.join(", ");
        docs.push({
          id,
          name: seg.hasCasas
            ? `${serie} — Fase ${phase.nome}`
            : `${serie} — Mundo ${phase.nome}`,
          status: isExisting ? "exists" : "planned",
          notes: seg.hasCasas
            ? `Plano de aulas: 4 semanas (${semanaNames}) da fase ${phase.nome} para ${serie}. Inclui: objetivo semanal, atividades, papel do professor, materiais. COM casas diferenciadas.`
            : `Plano de aulas: 4 semanas (${semanaNames}) do Mundo ${phase.nome} (${phase.im}) para ${serie}. SEM casas — todos fazem as mesmas atividades. Foco: ${phase.pergunta || "experiência vivencial"}`,
          serie,
          im: phase.nome,
          segment: segKey,
          segLabel: seg.label,
          hasCasas: seg.hasCasas,
        });
      });
    });
  });
  return docs;
}

function generateMissaoDocs() {
  const docs = [];
  Object.entries(SEGMENTS).forEach(([segKey, seg]) => {
    seg.series.forEach((serie) => {
      seg.phases.forEach((phase) => {
        const cleanSerie = serie.replace(/\s|º|-/g, "");
        const cleanPhase = phase.nome.replace(/[^a-zA-Z]/g, "").substring(0, 5);
        const id = `F-${cleanSerie}-${cleanPhase}`;
        const isExisting = (serie === "6º Ano" && phase.nome === "Interpessoal") || (serie === "6º Ano" && phase.im === "Interpessoal");
        docs.push({
          id,
          name: seg.hasCasas
            ? `Missões ${serie} — Fase ${phase.nome}`
            : `Missões ${serie} — Mundo ${phase.nome}`,
          status: isExisting ? "exists" : "planned",
          notes: seg.hasCasas
            ? `Missões semanais (S1-S4) da fase ${phase.nome} para ${serie}. Inclui: Missão do Projeto (todos) + Missão da Casa (8 versões por IM).`
            : `Missões semanais (S1-S4) do Mundo ${phase.nome} para ${serie}. SEM diferenciação por casa — missão única para todos. ${seg.sublabel}.`,
          serie,
          im: phase.nome,
          segment: segKey,
          segLabel: seg.label,
          hasCasas: seg.hasCasas,
        });
      });
    });
  });
  return docs;
}

function StatusBadge({ status, small = false }) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[4];
  return (
    <span
      style={{
        display: "inline-block",
        padding: small ? "1px 6px" : "2px 10px",
        borderRadius: 6,
        fontSize: small ? 10 : 11,
        fontWeight: 600,
        color: opt.color,
        background: opt.color + "18",
        border: `1px solid ${opt.color}30`,
        whiteSpace: "nowrap",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {opt.label}
    </span>
  );
}

function DocItem({ doc, onStatusChange, onNotesChange }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${expanded ? COLORS.border : "transparent"}`,
        borderRadius: 8,
        marginBottom: 4,
        transition: "all 0.15s",
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        <span style={{ color: COLORS.textDim, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", minWidth: 36 }}>
          {doc.id}
        </span>
        <span style={{ flex: 1, fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{doc.name}</span>
        <StatusBadge status={doc.status} />
        <span style={{ color: COLORS.textDim, fontSize: 14, transform: expanded ? "rotate(180deg)" : "", transition: "0.15s" }}>▾</span>
      </div>
      {expanded && (
        <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em" }}>STATUS</label>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(doc.id, opt.value)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${doc.status === opt.value ? opt.color : COLORS.border}`,
                    background: doc.status === opt.value ? opt.color + "20" : "transparent",
                    color: doc.status === opt.value ? opt.color : COLORS.textDim,
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em" }}>NOTAS</label>
            <textarea
              value={doc.notes}
              onChange={(e) => onNotesChange(doc.id, e.target.value)}
              style={{
                width: "100%",
                marginTop: 4,
                padding: 10,
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                color: COLORS.text,
                fontSize: 12,
                fontFamily: "'IBM Plex Sans', sans-serif",
                resize: "vertical",
                minHeight: 60,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MatrixView({ docs, type, onStatusChange, onNotesChange }) {
  const segmentKeys = [...new Set(docs.map(d => d.segment))];
  const [selectedSegment, setSelectedSegment] = useState(segmentKeys[0] || "infantil");
  const [selectedSerie, setSelectedSerie] = useState(null);

  const seg = SEGMENTS[selectedSegment];
  const segDocs = docs.filter(d => d.segment === selectedSegment);
  const seriesInSeg = [...new Set(segDocs.map(d => d.serie))];
  
  // Auto-select first serie when segment changes
  const activeSerie = selectedSerie && seriesInSeg.includes(selectedSerie) ? selectedSerie : seriesInSeg[0];
  const filtered = segDocs.filter(d => d.serie === activeSerie);

  const segStats = {
    exists: segDocs.filter(d => d.status === "exists").length,
    total: segDocs.length,
  };

  return (
    <div>
      {/* Segment selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
        {segmentKeys.map(sk => {
          const s = SEGMENTS[sk];
          const cnt = docs.filter(d => d.segment === sk && d.status === "exists").length;
          const tot = docs.filter(d => d.segment === sk).length;
          const isActive = selectedSegment === sk;
          return (
            <button
              key={sk}
              onClick={() => { setSelectedSegment(sk); setSelectedSerie(null); }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${isActive ? COLORS.pink : COLORS.border}`,
                background: isActive ? COLORS.pinkBg : "transparent",
                color: isActive ? COLORS.pink : COLORS.textDim,
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s.label} <span style={{ fontSize: 9, opacity: 0.7 }}>({cnt}/{tot})</span>
            </button>
          );
        })}
      </div>

      {/* Segment info banner */}
      {seg && (
        <div style={{
          background: seg.hasCasas ? COLORS.blueBg : COLORS.orangeBg,
          border: `1px solid ${seg.hasCasas ? COLORS.blue : COLORS.orange}30`,
          borderRadius: 8, padding: "8px 12px", marginBottom: 10,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: seg.hasCasas ? COLORS.blue : COLORS.orange }}>
            {seg.sublabel}
          </span>
          <span style={{ fontSize: 10, color: COLORS.textDim }}>•</span>
          <span style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>
            {seg.hasCasas ? "COM Casas diferenciadas" : "SEM Casas — atividade única para todos"}
          </span>
          <span style={{ fontSize: 10, color: COLORS.textDim }}>•</span>
          <span style={{ fontSize: 10, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>
            Semanas: {seg.semanas.join(" → ")}
          </span>
        </div>
      )}

      {/* Series sub-tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {seriesInSeg.map((s) => {
          const count = segDocs.filter((d) => d.serie === s && d.status === "exists").length;
          const total = segDocs.filter((d) => d.serie === s).length;
          return (
            <button
              key={s}
              onClick={() => setSelectedSerie(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                border: `1px solid ${activeSerie === s ? COLORS.blue : COLORS.border}`,
                background: activeSerie === s ? COLORS.blueBg : "transparent",
                color: activeSerie === s ? COLORS.blue : COLORS.textMuted,
                fontSize: 11,
                fontWeight: activeSerie === s ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {s} <span style={{ opacity: 0.6 }}>({count}/{total})</span>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
        {activeSerie}: {filtered.filter(d => d.status === "exists").length}/{filtered.length} prontos
      </div>

      {filtered.map((doc) => (
        <DocItem key={doc.id} doc={doc} onStatusChange={onStatusChange} onNotesChange={onNotesChange} />
      ))}
    </div>
  );
}

function AddDocModal({ onAdd, onClose, categoryId }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("create");

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000080", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, width: "90%", maxWidth: 420 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, color: COLORS.text }}>Adicionar Documento à Categoria {categoryId}</h3>
        <input
          placeholder="Nome do documento"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, marginBottom: 10, outline: "none", boxSizing: "border-box" }}
        />
        <textarea
          placeholder="Notas / descrição do que contém"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", padding: 10, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, minHeight: 80, resize: "vertical", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 4, margin: "10px 0", flexWrap: "wrap" }}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${status === opt.value ? opt.color : COLORS.border}`, background: status === opt.value ? opt.color + "20" : "transparent", color: status === opt.value ? opt.color : COLORS.textDim, fontSize: 11, cursor: "pointer" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: 13 }}>
            Cancelar
          </button>
          <button
            onClick={() => { if (name.trim()) { onAdd(name, notes, status); onClose(); } }}
            style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: COLORS.blue, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

const DEMANDAS_KEY = "arboria-demandas-v1";
const DEMAND_AREAS = [
  { value: "app", label: "📱 App/Lovable", color: "#3b82f6" },
  { value: "docs", label: "📄 Documentação", color: "#22c55e" },
  { value: "pedagogico", label: "🎓 Pedagógico", color: "#8b5cf6" },
  { value: "design", label: "🎨 Design/Assets", color: "#ec4899" },
  { value: "tecnico", label: "⚙️ Técnico/Supabase", color: "#f59e0b" },
  { value: "ideia", label: "💡 Ideia Nova", color: "#06b6d4" },
];
const DEMAND_STATUS = [
  { value: "backlog", label: "📋 Backlog", color: COLORS.textDim },
  { value: "todo", label: "🔜 Para Fazer", color: COLORS.orange },
  { value: "doing", label: "🔄 Fazendo", color: COLORS.blue },
  { value: "review", label: "👀 Revisão", color: COLORS.purple },
  { value: "done", label: "✅ Feito", color: COLORS.green },
];
const DEMAND_PRIORITY = [
  { value: "urgent", label: "🔴 Urgente", color: "#ef4444" },
  { value: "high", label: "🟠 Alta", color: "#f59e0b" },
  { value: "medium", label: "🟡 Média", color: "#eab308" },
  { value: "low", label: "🟢 Baixa", color: "#22c55e" },
];

function DemandasBoard() {
  const [demands, setDemands] = useState([]);
  const [filter, setFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const r = await window.storage.get(DEMANDAS_KEY);
        if (r && r.value) setDemands(JSON.parse(r.value));
      } catch(e) {}
    }
    load();
  }, []);

  useEffect(() => {
    if (demands.length > 0) {
      window.storage.set(DEMANDAS_KEY, JSON.stringify(demands)).catch(() => {});
    }
  }, [demands]);

  const addDemand = (d) => {
    const newD = { ...d, id: Date.now().toString(), created: new Date().toISOString() };
    setDemands(prev => [newD, ...prev]);
    setShowAdd(false);
  };

  const updateDemand = (id, updates) => {
    setDemands(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDemand = (id) => {
    if (confirm("Remover esta demanda?")) setDemands(prev => prev.filter(d => d.id !== id));
  };

  const filtered = demands.filter(d => {
    if (filter !== "all" && d.status !== filter) return false;
    if (areaFilter !== "all" && d.area !== areaFilter) return false;
    return true;
  });

  const counts = {};
  DEMAND_STATUS.forEach(s => { counts[s.value] = demands.filter(d => d.status === s.value).length; });

  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#f59e0b10", border: `1px solid ${COLORS.orange}25`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.orange }}>📋 Demandas & Ideias</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.textMuted }}>Tudo que precisa fazer, criar ou investigar. Nada se perde.</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: COLORS.orange, color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Nova Demanda</button>
        </div>
      </div>

      {/* Status cards */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
        <button onClick={() => setFilter("all")} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${filter === "all" ? COLORS.text : COLORS.border}`, background: filter === "all" ? COLORS.surfaceActive : "transparent", color: filter === "all" ? COLORS.text : COLORS.textDim, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
          Todas ({demands.length})
        </button>
        {DEMAND_STATUS.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${filter === s.value ? s.color : COLORS.border}`, background: filter === s.value ? s.color + "18" : "transparent", color: filter === s.value ? s.color : COLORS.textDim, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            {s.label} ({counts[s.value] || 0})
          </button>
        ))}
      </div>

      {/* Area filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
        <button onClick={() => setAreaFilter("all")} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: areaFilter === "all" ? COLORS.surfaceActive : "transparent", color: areaFilter === "all" ? COLORS.text : COLORS.textDim, fontSize: 10, cursor: "pointer" }}>Todas áreas</button>
        {DEMAND_AREAS.map(a => (
          <button key={a.value} onClick={() => setAreaFilter(a.value)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: areaFilter === a.value ? a.color + "20" : "transparent", color: areaFilter === a.value ? a.color : COLORS.textDim, fontSize: 10, cursor: "pointer", whiteSpace: "nowrap" }}>{a.label}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: COLORS.textDim }}>
          {demands.length === 0 ? "Nenhuma demanda ainda. Clique em '+ Nova Demanda' para começar." : "Nenhuma demanda com esses filtros."}
        </div>
      )}

      {filtered.map(d => {
        const area = DEMAND_AREAS.find(a => a.value === d.area);
        const status = DEMAND_STATUS.find(s => s.value === d.status);
        const priority = DEMAND_PRIORITY.find(p => p.value === d.priority);
        const isEditing = editId === d.id;
        return (
          <div key={d.id} style={{ background: COLORS.surface, border: `1px solid ${d.status === "done" ? COLORS.green + "30" : COLORS.border}`, borderRadius: 10, padding: 14, marginBottom: 8, opacity: d.status === "done" ? 0.6 : 1 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                  {priority && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: priority.color + "20", color: priority.color, fontWeight: 600 }}>{priority.label}</span>}
                  {area && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: area.color + "20", color: area.color, fontWeight: 600 }}>{area.label}</span>}
                  <span style={{ fontSize: 9, color: COLORS.textDim }}>{new Date(d.created).toLocaleDateString("pt-BR")}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: d.status === "done" ? COLORS.textDim : COLORS.text, textDecoration: d.status === "done" ? "line-through" : "none" }}>{d.title}</div>
                {d.description && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, lineHeight: 1.5 }}>{d.description}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <select value={d.status} onChange={(e) => updateDemand(d.id, { status: e.target.value })} style={{ fontSize: 10, padding: "3px 6px", background: COLORS.surfaceActive, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: status?.color || COLORS.text, cursor: "pointer" }}>
                  {DEMAND_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <button onClick={() => deleteDemand(d.id)} style={{ fontSize: 9, color: COLORS.textDim, background: "none", border: "none", cursor: "pointer", padding: 2 }}>🗑️</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add modal */}
      {showAdd && <AddDemandModal onAdd={addDemand} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddDemandModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("app");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("backlog");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, width: "100%", maxWidth: 440 }}>
        <h3 style={{ margin: "0 0 16px", color: COLORS.text, fontSize: 16 }}>📋 Nova Demanda</h3>

        <label style={{ fontSize: 10, color: COLORS.textDim, display: "block", marginBottom: 4 }}>TÍTULO *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O que precisa ser feito?" style={{ width: "100%", padding: "8px 12px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, marginBottom: 12, outline: "none", boxSizing: "border-box" }} />

        <label style={{ fontSize: 10, color: COLORS.textDim, display: "block", marginBottom: 4 }}>DESCRIÇÃO</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes, contexto, referências..." rows={3} style={{ width: "100%", padding: "8px 12px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12, marginBottom: 12, outline: "none", resize: "vertical", boxSizing: "border-box" }} />

        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ fontSize: 10, color: COLORS.textDim, display: "block", marginBottom: 4 }}>ÁREA</label>
            <select value={area} onChange={(e) => setArea(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }}>
              {DEMAND_AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ fontSize: 10, color: COLORS.textDim, display: "block", marginBottom: 4 }}>PRIORIDADE</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }}>
              {DEMAND_PRIORITY.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ fontSize: 10, color: COLORS.textDim, display: "block", marginBottom: 4 }}>STATUS INICIAL</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12 }}>
              {DEMAND_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
          <button onClick={() => { if (title.trim()) onAdd({ title: title.trim(), description: description.trim(), area, priority, status }); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: COLORS.orange, color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", opacity: title.trim() ? 1 : 0.5 }}>Criar Demanda</button>
        </div>
      </div>
    </div>
  );
}

function FolderMap() {
  const [expandedFolders, setExpandedFolders] = useState(new Set(["root", "A", "B", "C"]));
  
  const toggleFolder = (id) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set();
    const collect = (items, prefix) => items.forEach((item, i) => {
      const id = prefix + "-" + i;
      all.add(id);
      if (item.children) collect(item.children, id);
    });
    FOLDER_TREE.forEach((item, i) => { all.add("root"); all.add("f-" + i); if (item.children) collect(item.children, "f-" + i); });
    setExpandedFolders(all);
  };

  const collapseAll = () => setExpandedFolders(new Set(["root"]));

  const FOLDER_TREE = [
    {
      name: "A — Fundamentos Pedagógicos", icon: "🌳", color: COLORS.green,
      children: [
        { name: "Manifesto_Arboria.pdf", icon: "📄" },
        { name: "Documento_Mestre_F1.docx", icon: "📄" },
        { name: "Documento_Mestre_Infantil.docx", icon: "📄" },
        { name: "Poder_de_Acreditar.pdf", icon: "📄" },
        { name: "Estudos_de_Caso.pdf", icon: "📄" },
        { name: "Arquetipos.pdf", icon: "📄" },
      ]
    },
    {
      name: "B — Dossiês das 8 Inteligências", icon: "🧠", color: COLORS.purple,
      children: [
        { name: "Dossie_Linguistica.pdf", icon: "📄" },
        { name: "Dossie_Logico_Matematica.docx", icon: "📄" },
        { name: "Dossie_Espacial.docx", icon: "📄" },
        { name: "Dossie_Musical.docx", icon: "📄" },
        { name: "Dossie_Corporal_Cinestesica.docx", icon: "📄" },
        { name: "Dossie_Naturalista.docx", icon: "📄" },
        { name: "Dossie_Interpessoal.docx", icon: "📄" },
        { name: "Dossie_Intrapessoal.docx", icon: "📄" },
      ]
    },
    {
      name: "C — Documentação Técnica", icon: "⚙️", color: COLORS.cyan,
      children: [
        { name: "Especificacao_Tecnica_App.docx", icon: "📄" },
        { name: "Livro_do_Aluno_Especificacao.docx", icon: "📄" },
        { name: "Banco_de_Dados_Snapshot.md", icon: "📄", tag: "CRIAR" },
        { name: "Changelog.md", icon: "📄", tag: "CRIAR" },
        { name: "Bugs_e_Pendencias.md", icon: "📄", tag: "CRIAR" },
        { name: "Fluxos_N8N.md", icon: "📄", tag: "CRIAR" },
      ]
    },
    {
      name: "D — Operacional & Professor", icon: "👨‍🏫", color: COLORS.orange,
      children: [
        { name: "Guia_Apuracao_Professor.docx", icon: "📄" },
        { name: "Dicionario_Expandido_IA.pdf", icon: "📄" },
        { name: "Dicionario_Observacoes.pdf", icon: "📄" },
      ]
    },
    {
      name: "E — Guias do Professor (Maternal II ao 9º Ano)", icon: "📚", color: COLORS.blue,
      children: [
        {
          name: "Infantil/", icon: "📁", children: [
            { name: "Maternal_II/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "Maternal_III/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "Grupo_IV/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "Grupo_V/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "Fundamental_1/", icon: "📁", children: [
            { name: "1o_Ano/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "2o_Ano/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "3o_Ano/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "4o_Ano/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
            { name: "5o_Ano/ (8 fases × 1 guia)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "Fundamental_2/", icon: "📁", children: [
            {
              name: "6o_Ano", icon: "📁", children: [
                { name: "Guia_6Ano_Intrapessoal.pdf", icon: "📄" },
                { name: "Guia_6Ano_Interpessoal.pdf", icon: "📄", tag: "PRÓXIMO" },
                { name: "...(6 fases restantes)", icon: "📄", tag: "FUTURO" },
              ]
            },
            {
              name: "7o_Ano", icon: "📁", children: [
                { name: "Guia_7Ano_Intrapessoal.pdf", icon: "📄" },
                { name: "Guia_7Ano_Interpessoal.pdf", icon: "📄", tag: "PRÓXIMO" },
                { name: "...(6 fases restantes)", icon: "📄", tag: "FUTURO" },
              ]
            },
            {
              name: "8o_Ano", icon: "📁", children: [
                { name: "Guia_8Ano_Intrapessoal.pdf", icon: "📄", tag: "PENDENTE" },
                { name: "...(7 fases restantes)", icon: "📄", tag: "FUTURO" },
              ]
            },
            {
              name: "9o_Ano", icon: "📁", children: [
                { name: "Guia_9Ano_Intrapessoal.pdf", icon: "📄", tag: "PENDENTE" },
                { name: "...(7 fases restantes)", icon: "📄", tag: "FUTURO" },
              ]
            },
          ]
        },
      ]
    },
    {
      name: "F — Missões Semanais (Maternal II ao 9º Ano)", icon: "🎯", color: COLORS.pink,
      children: [
        {
          name: "Infantil/ (sem casas — missão única por fase)", icon: "📁", children: [
            { name: "Maternal_II/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "Maternal_III/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "Grupo_IV/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "Grupo_V/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "Fundamental_1/ (sem casas — missão única por fase)", icon: "📁", children: [
            { name: "1o_Ano/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "2o_Ano/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "3o_Ano/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "4o_Ano/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
            { name: "5o_Ano/ (8 fases × 4 semanas)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "Fundamental_2/ (com casas — 8 PDFs por semana)", icon: "📁", children: [
            {
              name: "6o_Ano", icon: "📁", children: [
            {
              name: "Fase_Intrapessoal", icon: "📁", children: [
                { name: "Semana_1/", icon: "📁", tag: "✅ 8 PDFs", children: [
                  { name: "Missao_S1_linguistica.pdf", icon: "📄" },
                  { name: "Missao_S1_logico_matematica.pdf", icon: "📄" },
                  { name: "Missao_S1_espacial.pdf", icon: "📄" },
                  { name: "Missao_S1_musical.pdf", icon: "📄" },
                  { name: "Missao_S1_corporal_cinestesica.pdf", icon: "📄" },
                  { name: "Missao_S1_interpessoal.pdf", icon: "📄" },
                  { name: "Missao_S1_intrapessoal.pdf", icon: "📄" },
                  { name: "Missao_S1_naturalista.pdf", icon: "📄" },
                ]},
                { name: "Semana_2/  (8 PDFs)", icon: "📁", tag: "GERAR" },
                { name: "Semana_3/  (8 PDFs)", icon: "📁", tag: "GERAR" },
                { name: "Semana_4/  (8 PDFs)", icon: "📁", tag: "GERAR" },
              ]
            },
            { name: "Fase_Interpessoal/ (S1-S4 × 8 casas)", icon: "📁", tag: "FUTURO" },
            { name: "...(6 fases restantes)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "7o_Ano", icon: "📁", children: [
            {
              name: "Fase_Intrapessoal", icon: "📁", children: [
                { name: "Semana_1/  (8 PDFs)", icon: "📁", tag: "✅ 8 PDFs" },
                { name: "Semana_2/  (8 PDFs)", icon: "📁", tag: "GERAR" },
                { name: "Semana_3/  (8 PDFs)", icon: "📁", tag: "GERAR" },
                { name: "Semana_4/  (8 PDFs)", icon: "📁", tag: "GERAR" },
              ]
            },
            { name: "...(7 fases restantes)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "8o_Ano", icon: "📁", children: [
            { name: "Fase_Intrapessoal/ (S1-S4 × 8 casas)", icon: "📁", tag: "GERAR" },
            { name: "...(7 fases restantes)", icon: "📁", tag: "FUTURO" },
          ]
        },
        {
          name: "9o_Ano", icon: "📁", children: [
            { name: "Fase_Intrapessoal/ (S1-S4 × 8 casas)", icon: "📁", tag: "GERAR" },
            { name: "...(7 fases restantes)", icon: "📁", tag: "FUTURO" },
          ]
        },
          ]
        },
      ]
    },
    {
      name: "G — Assets (Brasões e Imagens)", icon: "🎨", color: "#e879f9",
      children: [
        { name: "linguistica.png", icon: "🖼️" },
        { name: "logico-matematica.png", icon: "🖼️" },
        { name: "espacial.png", icon: "🖼️" },
        { name: "musical.png", icon: "🖼️" },
        { name: "corporal.png", icon: "🖼️" },
        { name: "interpessoal.png", icon: "🖼️" },
        { name: "intrapessoal.png", icon: "🖼️" },
        { name: "naturalista.png", icon: "🖼️" },
        { name: "logo_arboria.png", icon: "🖼️" },
      ]
    },
    {
      name: "H — Credenciais & Boas-Vindas", icon: "🔑", color: "#f472b6",
      children: [
        { name: "Credenciais_F2_157_alunos.pdf", icon: "📄" },
        { name: "CasasAlunos_Liderancas.pdf", icon: "📄" },
        { name: "Boas_Vindas_157_Alunos.pdf", icon: "📄" },
        { name: "Boas_Vindas_Gerador.jsx", icon: "📄" },
        { name: "Extras_Individuais/", icon: "📁", children: [
          { name: "Dhavi_Ferreira.pdf", icon: "📄" },
          { name: "Isabelly_Mayanne.pdf", icon: "📄" },
          { name: "Ketelyn_Lohane.pdf", icon: "📄" },
          { name: "Nicole_Lorhanna.pdf", icon: "📄" },
        ]},
      ]
    },
    {
      name: "I — Ferramentas & Prompts", icon: "🛠️", color: "#a78bfa",
      children: [
        { name: "Prompt_Gerador_Missoes_Arboria.md", icon: "📄" },
        { name: "Registro_Vivo.jsx", icon: "📄" },
        { name: "Diario_de_Campo.jsx", icon: "📄" },
        { name: "Prompts_Lovable/", icon: "📁", children: [
          { name: "01_fase_semana_home_professor.txt", icon: "📄" },
          { name: "02_fase_semana_home_aluno.txt", icon: "📄" },
          { name: "03_conselho_lideres.txt", icon: "📄" },
          { name: "04_lideranca_casa.txt", icon: "📄" },
          { name: "05_chat_admin.txt", icon: "📄" },
          { name: "06_missoes_8fases.txt", icon: "📄" },
          { name: "07_casa_hierarquia.txt", icon: "📄" },
          { name: "08_missao_pdf_inline.txt", icon: "📄" },
          { name: "09_pdf_bloqueado_fix.txt", icon: "📄" },
          { name: "10_filtro_fase_serie.txt", icon: "📄" },
          { name: "11_foto_perfil.txt", icon: "📄" },
          { name: "12_logs_atividades.txt", icon: "📄" },
          { name: "13_lockfile_vercel.txt", icon: "📄" },
        ]},
      ]
    },
  ];

  const TAG_COLORS = {
    "CRIAR": COLORS.red,
    "GERAR": COLORS.orange,
    "PENDENTE": COLORS.orange,
    "PRÓXIMO": COLORS.blue,
    "FUTURO": COLORS.textDim,
    "✅ 8 PDFs": COLORS.green,
  };

  const renderTree = (items, depth = 0, parentId = "f") => {
    return items.map((item, i) => {
      const id = `${parentId}-${i}`;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = expandedFolders.has(id);
      const isFile = !hasChildren;
      return (
        <div key={id}>
          <div
            onClick={() => hasChildren && toggleFolder(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 8px",
              paddingLeft: (depth * 20 + 8),
              cursor: hasChildren ? "pointer" : "default",
              borderRadius: 6,
              fontSize: isFile ? 11 : 12,
              fontWeight: isFile ? 400 : 600,
              color: isFile ? COLORS.textMuted : (item.color || COLORS.text),
              background: "transparent",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = COLORS.surfaceHover}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            {hasChildren && <span style={{ fontSize: 10, color: COLORS.textDim, width: 12 }}>{isOpen ? "▼" : "▶"}</span>}
            {!hasChildren && <span style={{ width: 12 }} />}
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.name}</span>
            {item.tag && (
              <span style={{
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 4,
                background: (TAG_COLORS[item.tag] || COLORS.textDim) + "20",
                color: TAG_COLORS[item.tag] || COLORS.textDim,
                fontWeight: 600,
              }}>
                {item.tag}
              </span>
            )}
          </div>
          {hasChildren && isOpen && renderTree(item.children, depth + 1, id)}
        </div>
      );
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#22c55e10", border: `1px solid ${COLORS.green}25`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.green }}>📁 Mapa de Pastas — Computador</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.textMuted }}>Estrutura recomendada para organizar todos os arquivos do Projeto Arboria no seu computador</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={expandAll} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, fontSize: 11, cursor: "pointer" }}>Expandir tudo</button>
            <button onClick={collapseAll} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, fontSize: 11, cursor: "pointer" }}>Recolher</button>
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 8px", fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", marginBottom: 8, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
          <span style={{ fontSize: 14 }}>🌳</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Projeto_Arboria/</span>
          <span style={{ fontSize: 10, color: COLORS.textDim }}>(raiz)</span>
        </div>
        {renderTree(FOLDER_TREE)}
      </div>

      <div style={{ marginTop: 16, padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>LEGENDA</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11 }}>
          {Object.entries(TAG_COLORS).map(([tag, color]) => (
            <div key={tag} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ color: COLORS.textMuted }}>{tag}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: COLORS.textDim, lineHeight: 1.6 }}>
          <strong style={{ color: COLORS.textMuted }}>Dica:</strong> Crie essa estrutura no seu computador. Conforme for gerando os documentos, vá movendo para a pasta correspondente. As tags mostram o que já existe, o que precisa criar e o que é futuro.
        </div>
      </div>
    </div>
  );
}

export default function ArboriaRegistry() {
  const [categories, setCategories] = useState(null);
  const [activeTab, setActiveTab] = useState("A");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(null);
  const [showFolderMap, setShowFolderMap] = useState(false);
  const [showDemandas, setShowDemandas] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          if (parsed && parsed.length > 0) {
            setCategories(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (e) { /* first load */ }
      const init = initialCategories.map((cat) => {
        if (cat.id === "E") return { ...cat, docs: generateAulaDocs() };
        if (cat.id === "F") return { ...cat, docs: generateMissaoDocs() };
        return cat;
      });
      setCategories(init);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (categories && !loading) {
      window.storage.set(STORAGE_KEY, JSON.stringify(categories)).catch(() => {});
    }
  }, [categories, loading]);

  if (loading || !categories) {
    return <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted }}>Carregando registro...</div>;
  }

  const activeCat = categories.find((c) => c.id === activeTab) || categories[0];

  const handleStatusChange = (docId, newStatus) => {
    setCategories((prev) =>
      prev.map((cat) => cat.id === activeTab ? { ...cat, docs: cat.docs.map((d) => (d.id === docId ? { ...d, status: newStatus } : d)) } : cat)
    );
  };

  const handleNotesChange = (docId, newNotes) => {
    setCategories((prev) =>
      prev.map((cat) => cat.id === activeTab ? { ...cat, docs: cat.docs.map((d) => (d.id === docId ? { ...d, notes: newNotes } : d)) } : cat)
    );
  };

  const handleAddDoc = (name, notes, status) => {
    const cat = categories.find((c) => c.id === activeTab);
    const newId = `${activeTab}-${(cat.docs.length + 1).toString().padStart(2, "0")}`;
    setCategories((prev) =>
      prev.map((c) => c.id === activeTab ? { ...c, docs: [...c.docs, { id: newId, name, notes, status }] } : c)
    );
  };

  const totalDocs = categories.reduce((a, c) => a + c.docs.length, 0);
  const existsDocs = categories.reduce((a, c) => a + c.docs.filter((d) => d.status === "exists").length, 0);
  const createDocs = categories.reduce((a, c) => a + c.docs.filter((d) => d.status === "create").length, 0);
  const updateDocs = categories.reduce((a, c) => a + c.docs.filter((d) => d.status === "update").length, 0);
  const plannedDocs = categories.reduce((a, c) => a + c.docs.filter((d) => d.status === "planned").length, 0);

  const filteredDocs = searchTerm
    ? activeCat.docs.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    : activeCat.docs;

  const isMatrix = activeTab === "E" || activeTab === "F";

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, background: COLORS.bg, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>🌳</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}>REGISTRO VIVO — PROJETO ARBORIA</h1>
            <p style={{ margin: 0, fontSize: 10, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>
              Índice mestre · Os dados persistem entre sessões
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          {[
            { label: "Total", value: totalDocs, color: COLORS.text },
            { label: "Prontos", value: existsDocs, color: COLORS.green },
            { label: "Atualizar", value: updateDocs, color: COLORS.orange },
            { label: "Criar", value: createDocs, color: COLORS.red },
            { label: "Planejados", value: plannedDocs, color: COLORS.textDim },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'IBM Plex Mono', monospace" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: COLORS.textDim, letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
          {/* Progress bar */}
          <div style={{ flex: 1, minWidth: 120, display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", height: 6, background: COLORS.surfaceActive, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(existsDocs / totalDocs) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})`, borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <span style={{ marginLeft: 8, fontSize: 11, color: COLORS.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>{Math.round((existsDocs / totalDocs) * 100)}%</span>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
        />

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 2 }}>
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            const catExists = cat.docs.filter((d) => d.status === "exists").length;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveTab(cat.id); setSearchTerm(""); setShowFolderMap(false); setShowDemandas(false); }}
                style={{
                  padding: "5px 10px",
                  background: isActive ? cat.color + "18" : "transparent",
                  border: `1px solid ${isActive ? cat.color : "transparent"}`,
                  borderRadius: 8,
                  color: isActive ? cat.color : COLORS.textDim,
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {cat.emoji} {cat.id}
                <span style={{ fontSize: 9, opacity: 0.7 }}>({catExists}/{cat.docs.length})</span>
              </button>
            );
          })}
          <button
            onClick={() => { setShowFolderMap(true); setActiveTab(null); setSearchTerm(""); setShowDemandas(false); }}
            style={{
              padding: "5px 10px",
              background: showFolderMap ? "#22c55e18" : "transparent",
              border: `1px solid ${showFolderMap ? COLORS.green : "transparent"}`,
              borderRadius: 8,
              color: showFolderMap ? COLORS.green : COLORS.textDim,
              fontSize: 11,
              fontWeight: showFolderMap ? 700 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            📁 Pastas
          </button>
          <button
            onClick={() => { setShowDemandas(true); setShowFolderMap(false); setActiveTab(null); setSearchTerm(""); }}
            style={{
              padding: "5px 10px",
              background: showDemandas ? "#f59e0b18" : "transparent",
              border: `1px solid ${showDemandas ? COLORS.orange : "transparent"}`,
              borderRadius: 8,
              color: showDemandas ? COLORS.orange : COLORS.textDim,
              fontSize: 11,
              fontWeight: showDemandas ? 700 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            📋 Demandas
          </button>
        </div>
      </div>

      {/* Content */}
      {showFolderMap ? (
        <FolderMap />
      ) : showDemandas ? (
        <DemandasBoard />
      ) : (
      <div style={{ padding: 20 }}>
        {/* Category header */}
        <div style={{ background: activeCat.colorBg, border: `1px solid ${activeCat.color}25`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: activeCat.color }}>
                {activeCat.emoji} {activeCat.name}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.textMuted }}>{activeCat.description}</p>
            </div>
            <button
              onClick={() => setShowAdd(activeTab)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${activeCat.color}50`,
                background: activeCat.color + "15",
                color: activeCat.color,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + Novo Documento
            </button>
          </div>
        </div>

        {/* Docs list or matrix */}
        {isMatrix ? (
          <MatrixView docs={filteredDocs} type={activeTab} onStatusChange={handleStatusChange} onNotesChange={handleNotesChange} />
        ) : (
          filteredDocs.map((doc) => (
            <DocItem key={doc.id} doc={doc} onStatusChange={handleStatusChange} onNotesChange={handleNotesChange} />
          ))
        )}

        {filteredDocs.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.textDim }}>
            {searchTerm ? `Nenhum documento encontrado para "${searchTerm}"` : "Nenhum documento nesta categoria ainda."}
          </div>
        )}
      </div>
      )}

      {/* Add modal */}
      {showAdd && <AddDocModal categoryId={showAdd} onAdd={handleAddDoc} onClose={() => setShowAdd(null)} />}
    </div>
  );
}



















