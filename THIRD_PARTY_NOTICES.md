# Third-party data notices

## New General Service List (NGSL) word frequencies

`src/data/ngsl-frequency-ranks.ts` contains the frequency-rank table from the
New General Service List (NGSL) 1.2, the primary source used to rank
vocabulary importance in this app (`src/data/preset-vocabulary.ts`):

> Browne, C., Culligan, B., & Phillips, J. (2013). The New General Service
> List. Retrieved from https://www.newgeneralservicelist.com.

The NGSL is a 2801-headword list of the most useful general-English words for
second-language learners, derived from a 273-million-word subsection of the
Cambridge English Corpus. It is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).
This file republishes the full public NGSL 1.2 frequency table (headwords and
their listed inflected/variant forms) under that license.

## SUBTLEX-US spoken-word frequencies

This app depends on [`subtlex-word-frequencies`](https://github.com/words/subtlex-word-frequencies)
version 2.0.0 (ISC license) at runtime, in `src/lib/full-word-frequency.ts`,
to give any word a real frequency rank (used as a fallback for words typed
into "Add word" that aren't part of the curated preset vocabulary or the
NGSL). `src/data/spoken-frequency-ranks.ts` contains a pre-computed subset of
the same data for the app's discover inventory. That package republishes data
from SUBTLEX-US:

> Brysbaert, M., & New, B. (2009). Moving beyond Kučera and Francis: A
> critical evaluation of current word frequency norms and the introduction of
> a new and improved word frequency measure for American English. *Behavior
> Research Methods, 41*(4), 977–990.

The rank map includes the full learnable-word SUBTLEX-US frequency table
(74,260 words). Regenerate with `npm run generate:subtlex`; do not hand-edit.
