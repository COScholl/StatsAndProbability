# StatsAndProbability
Collection of methods in JS using BigNumber library for statistics and probability

*This collection is a work in progress, please send suggestions and comments to chris(dot)o(dot)scholl(at)gmail*

### Why this and why JavaScript?

#### Why this?
I am not a mathematician. I have never studied statistics formally, and my study of probability
has been an amateur affair because of my interest in games that use dice. As I have found
need for these functions, I have researched and written them. There will be more in
the future, I am sure.

#### Why JavaScript?
This collection of functions in JavaScript is for personal projects that use JavaScript,
as I am continuing my self-education of programming and web design. When I take
up other languages again, I may re-create these functions, if there is need for efficiency
that JavaScript is not providing me.

This collection uses BigNumber.js (https://github.com/MikeMcl/bignumber.js/) to improve
the accuracy of math on floats, since probabilities are normalized to float numbers
between 0 and 1, and since precision of binary floating points leads to rounding errors
with some numbers (https://floating-point-gui.de/).

### Notes
One can see that I am interested in probabilities of dice rolls, as with the function
`pOfSumInDice()`, which gives the probability of a particular outcome in `n` trials with
`s` possible outcomes. My documentation specifically mentions `n` as the number
of dice, and `s` is the number of sides. These functions are translations of formulas
that I have found from various sources, and they are written to fit my understanding and
framework.

If you notice that I could be representing this information more clearly by
using naming conventions that are standard with statisticians, send me an email and let
me know what function in this collection you think could be named better, what they should
be called, and some documentation that is accessible and understandable to novices so that
I can learn more on the subject! Thanks!
