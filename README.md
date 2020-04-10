# modParser.js
A small js library to parse mod files.

## usage
Everything is contained in the global `modParser` variable. 
Read [this](https://greg-kennedy.com/tracker/modformat.html) for a more in-depth
explanation on how to use all this.

### methods
`async parseFile(file)`  --  parses a mod-file and returns a mod-object.

`parseString(string)` --  parses a binary string and returns a mod-object.


### mod-object
`name: String`  --  the name of the mod file.

`samples: []`  --  contains all samples.

`patterns: []`  --  contains all patterns.

`patternOrder: [Num]`  --  the order to play the patterns in.

### sample
`name: String`  --  name of the sample.

`data: []`  --  data for the sample. 

`sampleLength: Num`  --  length of the sample in bytes.

`finetune: Num`  --  finetune pitch.

`volume: Num`  --  volume between 0-64.

`repeatStart: Num`  --  Where to start repeating in bytes.

`repeatLength: Num`  --  How many times to repeat.

### pattern
A pattern is a two dimensional array. Rows indicate position 
and columns indicate channel. It is filled with channel objects.

### channel 
`period: String`  --  period of the channel, i.e. pitch, in the form of strings like C4 or C3.

`periodNum: Num`  --  the numerical representation of the period.

`sample: Num`  --  which sample should be played

`effect1: Num`  --  the effect the sample should be played with. first nibble

`effect2: Num `  --  details about the effect. second nibble

`effect2: Num `  --  details about the effect. third nibble