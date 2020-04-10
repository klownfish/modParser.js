# modParser.js
A small js library to parse mod files.

## usage
Everything is contained in the global `modParser` variable. 
Read [this](https://greg-kennedy.com/tracker/modformat.html) for a more in-depth
explanation on how to use all this.

### methods
`async parsefile(file)`  --  parses a mod-file and returns a mod-object.

`parse string(string)` --  parses a binary string and returns a mod-object.


### mod-object
`name: String`  --  the name of the mod file.

`samples: []`  --  contains all samples.

`patterns: []`  --  contains all patterns.

`patternOrder: [num]`  --  the order to play the patterns in.

### sample
`length: num`  --  how many bytes the sample contains.

`data: []`  --  data for the sample. 

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