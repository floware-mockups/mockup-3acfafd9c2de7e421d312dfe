// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("MemoriaDifensiva");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("MemoriaDifensiva");
import { useState } from "react";
import { Button, Card, Dialog, Select, TextArea, TextInput, Badge, useTable, usePrototype } from "../floware";

export default function MemoriaDifensiva({ pageId }) {__mk();
  const pratiche = useTable("pratiche");
  const documenti = useTable("documenti");
  const reddito = useTable("reddito");
  const { openDetail } = usePrototype();
  const [aperto, setAperto] = useState(false);
  const [codice, setCodice] = useState("");
  const [schede, setSchede] = useState([]);
  if (!["pratiche", "documenti", "reddito"].includes(pageId)) return null;
  if (!pratiche || pratiche.column("Codice pratica") < 0) return <p>Elenco pratiche non disponibile.</p>;
  const codici = pratiche.rows.map(r => (__mk(), pratiche.value(r, "Codice pratica"))).filter((c, i, elenco) => (__mk(), c && elenco.indexOf(c) === i));
  const scheda = schede.find(s => (__mk(), s.codice === codice)) || { codice, fatti: "", argomenti: "", richieste: "", motivi: [], bozza: "", modificata: false };
  function aggiorna(campi) {__mk();
    const nuova = { ...scheda, ...campi };
    setSchede(schede.filter(s => (__mk(), s.codice !== codice)).concat([nuova]));
  }
  const fonti = [
    { tabella: pratiche, id: "pratiche", titolo: "Pratiche" },
    { tabella: documenti, id: "documenti", titolo: "Verifica documenti" },
    { tabella: reddito, id: "reddito", titolo: "Anteprima reddito" }
  ];
  function riepilogo(fonte) {__mk();
    const t = fonte.tabella;
    if (!t || t.column("Codice pratica") < 0) return "Dati non disponibili";
    const indici = t.findRows("Codice pratica", codice);
    if (!indici.length) return "Nessuna corrispondenza";
    return indici.map(i => (__mk(), t.columns.filter(c => (__mk(), c !== "Richiedente" && c !== "Codice pratica")).map(c => (__mk(), c + ": " + t.value(i, c))).join("; "))).join("\n");
  }
  function genera() {__mk();
    const motivi = scheda.motivi.map((m, i) => (__mk(), (i + 1) + ". " + (m.titolo || "Motivo da completare") + "\n" + (m.testo || "[Sviluppare il motivo e verificare i riferimenti]"))).join("\n\n");
    const testo = "BOZZA DA RIVEDERE — DATI INVENTATI\nMemoria difensiva in materia di cittadinanza\nPratica: " + codice + "\n\n1. Oggetto e contesto\n[Precisare procedimento, atto cui si risponde, autorità destinataria e termini da verificare]\n\n2. Fatti esposti\n" + (scheda.fatti || "[Ricostruire i fatti]") + "\n\n3. Dati del prototipo — esiti solo preliminari\n" + fonti.map(f => (__mk(), f.titolo + "\n" + riepilogo(f))).join("\n\n") + "\n\n4. Argomentazioni proposte\n" + (scheda.argomenti || "[Sviluppare le argomentazioni e verificare le fonti normative applicabili]") + "\n\n5. Motivi di difesa\n" + (motivi || "[Inserire i motivi di difesa]") + "\n\n6. Richieste\n" + (scheda.richieste || "[Precisare le richieste]") + "\n\n7. Allegati e revisione\n[Elencare gli allegati effettivamente disponibili]\nVerificare fatti, documenti, riferimenti normativi, termini e coerenza delle richieste con un professionista qualificato. Le soglie configurate e gli esiti del prototipo non costituiscono valutazioni legali definitive né attestano la sussistenza dei requisiti. Nessun invio effettuato.";
    aggiorna({ bozza: testo, modificata: false });
  }
  function sposta(i, passo) {__mk();
    const destinazione = i + passo;
    aggiorna({ motivi: scheda.motivi.map((m, j) => (__mk(), j === i ? scheda.motivi[destinazione] : j === destinazione ? scheda.motivi[i] : m)), modificata: true });
  }
  return <Card title="Memoria difensiva">
    <p>Predisponi una bozza con fatti e motivi di difesa. Solo dati inventati; contenuti in memoria durante l’uso del riquadro.</p>
    <Button onClick={() => (__mk(), setAperto(true))}>Prepara memoria</Button>
    {aperto && <Dialog title="Preparazione memoria difensiva" onClose={() => (__mk(), setAperto(false))} footer={<Button variant="secondary" onClick={() => (__mk(), setAperto(false))}>Chiudi</Button>}>
      <div className="space-y-4">
        <Badge tone="neutral">Bozza da sottoporre a revisione</Badge>
        <p>Gli esiti documentali e reddituali sono provvisori. Lo strumento assembla i testi inseriti: non verifica norme, termini o fondatezza giuridica e non invia atti.</p>
        <Select label="Pratica" value={codice} options={["", ...codici]} onChange={setCodice} />
        {codice && codici.includes(codice) && <>
          {fonti.map(f => (__mk(), <Card key={f.id} title={f.titolo}>
            <p className="whitespace-pre-wrap text-(--mk-muted)">{riepilogo(f)}</p>
            {f.tabella && f.tabella.column("Codice pratica") >= 0 && f.tabella.findRows("Codice pratica", codice).map(i => (__mk(), <Button key={i} variant="link" onClick={() => (__mk(), openDetail(f.id, i))}>Apri scheda collegata</Button>))}
          </Card>))}
          <TextArea label="Fatti e cronologia" value={scheda.fatti} onChange={v => (__mk(), aggiorna({ fatti: v, modificata: true }))} rows={4} />
          <TextArea label="Argomentazioni e riferimenti da verificare" value={scheda.argomenti} onChange={v => (__mk(), aggiorna({ argomenti: v, modificata: true }))} rows={4} />
          {scheda.motivi.map((m, i) => (__mk(), <Card key={i} title={"Motivo " + (i + 1)}>
            <TextInput label="Titolo" value={m.titolo} onChange={v => (__mk(), aggiorna({ motivi: scheda.motivi.map((x, j) => (__mk(), j === i ? { ...x, titolo: v } : x)), modificata: true }))} />
            <TextArea label="Sviluppo e documenti a sostegno" value={m.testo} onChange={v => (__mk(), aggiorna({ motivi: scheda.motivi.map((x, j) => (__mk(), j === i ? { ...x, testo: v } : x)), modificata: true }))} rows={3} />
            <Button disabled={i === 0} onClick={() => (__mk(), sposta(i, -1))}>Sposta su</Button>
            <Button disabled={i === scheda.motivi.length - 1} onClick={() => (__mk(), sposta(i, 1))}>Sposta giù</Button>
            <Button variant="danger" onClick={() => (__mk(), aggiorna({ motivi: scheda.motivi.filter((x, j) => (__mk(), j !== i)), modificata: true }))}>Rimuovi motivo</Button>
          </Card>))}
          <Button variant="secondary" onClick={() => (__mk(), aggiorna({ motivi: scheda.motivi.concat([{ titolo: "", testo: "" }]), modificata: true }))}>Aggiungi motivo</Button>
          <TextArea label="Richieste conclusive" value={scheda.richieste} onChange={v => (__mk(), aggiorna({ richieste: v, modificata: true }))} rows={3} />
          <p>Generare nuovamente sostituisce le modifiche manuali alla bozza. I dati collegati sono fotografati al momento della generazione.</p>
          <Button onClick={genera}>Genera bozza strutturata</Button>
          {scheda.modificata && scheda.bozza && <p>I contenuti preparatori sono cambiati: la bozza potrebbe non essere aggiornata.</p>}
          {scheda.bozza && <TextArea label="Bozza modificabile da rivedere" value={scheda.bozza} onChange={v => (__mk(), aggiorna({ bozza: v }))} rows={18} />}
        </>}
      </div>
    </Dialog>}
  </Card>;
}
