export type PossibleClueStatus = "UNANSWERED"|"SKIP"|"CORRECT"|"INCORRECT";
export type ClueStatus = {status: PossibleClueStatus, value: number, origValue: number, dailyDouble?: boolean};
export type Category = Array<ClueStatus>;
export type BoardArray = Array<Category>;