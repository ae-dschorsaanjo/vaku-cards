# Vaku Cards

[![License](https://img.shields.io/badge/License-BSD%202--Clause-green.svg)](https://opensource.org/licenses/BSD-2-Clause)

Simple flashcard application written in JavaScript, focusing on simplicity.

The cards are read from simple text input and parsed as minUp text.
minUp allows the following text formattings:

- `*bold*` (inline)
- `_italic_` italic (inline)
- `{comment}` not shown in output
- ``` `mono` ``` monospace (inline)
- `[note]` note (shows as "NOTE: " wherever it's written)
- `text|link` for links (converts a single word into a link)
- ``` `< monoblock >` ``` monospace block


## License

Copyright (c) 2021, ae-dschorsaanjo (b.zoltan.gorza@gmail.com)

The code is under BSD 2-Clause ("Simplified BSD") license, while the flashcard
definition files shall be under some other license, once they become to be.
