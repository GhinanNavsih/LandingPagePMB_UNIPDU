import { UNIPDU_PMB_KNOWLEDGE } from "./knowledgeBase";
import type { SiteContent } from "./content-schema";

// The dormitory section is published from the maintained knowledge base. It is
// deliberately kept out of the admin editing payload so the editor cannot
// accidentally or intentionally change it.
export const LOCKED_DORMITORY_START = "7. INFORMASI ASRAMA / PONDOK PESANTREN MAHASISWA:";
export const LOCKED_DORMITORY_END = "8. INFORMASI KONTAK & SEKRETARIAT:";

function extractLockedDormitoryKnowledge(source: string) {
  const start = source.indexOf(LOCKED_DORMITORY_START);
  if (start < 0) throw new Error("Knowledge base tidak memiliki bagian informasi asrama yang dikunci.");
  const end = source.indexOf(LOCKED_DORMITORY_END, start);
  if (end < 0) throw new Error("Knowledge base tidak memiliki penutup bagian informasi asrama yang dikunci.");
  return source.slice(start, end).trim();
}

export const LOCKED_DORMITORY_KNOWLEDGE = extractLockedDormitoryKnowledge(UNIPDU_PMB_KNOWLEDGE);

/** Remove every submitted copy of the protected section from editable text. */
export function stripLockedDormitoryKnowledge(source: string) {
  let cursor = 0;
  let result = "";
  while (cursor < source.length) {
    const start = source.indexOf(LOCKED_DORMITORY_START, cursor);
    if (start < 0) {
      result += source.slice(cursor);
      break;
    }
    result += source.slice(cursor, start);
    const end = source.indexOf(LOCKED_DORMITORY_END, start);
    if (end < 0) break;
    cursor = end + LOCKED_DORMITORY_END.length;
  }
  return result.replace(/\n{3,}/g, "\n\n").trim();
}

const DEFAULT_EDITABLE_KNOWLEDGE = stripLockedDormitoryKnowledge(UNIPDU_PMB_KNOWLEDGE);

/**
 * Apply server-owned content invariants before reading or writing Firestore.
 * The submitted locked field is ignored, and the canonical section is always
 * restored from the checked-in knowledge base.
 */
export function normalizeContent(content: SiteContent): SiteContent {
  const editableKnowledge = stripLockedDormitoryKnowledge(content.chatbot.knowledge) || DEFAULT_EDITABLE_KNOWLEDGE;
  return {
    ...content,
    chatbot: {
      ...content.chatbot,
      knowledge: editableKnowledge,
      lockedDormitories: LOCKED_DORMITORY_KNOWLEDGE,
    },
  };
}
