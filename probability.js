const BigNumber = require('bignumber.js');

/* Helper functions */

/**
 * Multiply base b by itself e number of times
 * @param  {number} b base
 * @param  {number} e exponent
 * @return {number}   exponentiated base
 */
const exponentiate = (b, e) => {
  return BigNumber(b).exponentiatedBy(e).toNumber();
}

/**
 * Iterative factorial for saving memory with large numbers
 * @param  {number} num number to factorialize
 * @return {number}     factorial of num
 */
const forFact = (num) => {
    let retVal = BigNumber(1);
    for (let i = 2; i <= num; i++)
        retVal = retVal.multipliedBy(i);

    return retVal.toNumber();
};

/**
 * Generate array of numbers in range start and stop by step
 * @param  {number} start    start of number range
 * @param  {number} stop     end of number range
 * @param  {number} [step=1] diff between sequential elems in retArr
 * @return {Array}           array of numbers
 */
const range = (start, stop, step = 1) => {
    let retArr = [start],
        rangeElem = start;
    while (rangeElem < stop) {
      // updates rangeElem by step and pushes into retArr
      retArr.push(rangeElem += step);
    }

    return retArr;
};

/*
  Probability space is composed of a sample space Ω, the event space ℱ, and
  the probability function P.
  Ω is the set of all possible outcomes.
  ℱ is a set of specific outcome parameters or events of the sample space to consider.
  ℱ contains sample space, that is, Ω ∈ ℱ.
  P is a function that determines the probability of each event in ℱ.
  P:Ω → [0,1], that is P assigns values to possible events of Ω between 0 and 1 inclusive.
  P:ℱ → [0,1], that is P assigns values to specific event parameters of ℱ between 0 and 1 inclusive.
  P(Ω) = 1, that is the sum of probability for all possible subsets of Ω is 1.
  P(∅) = 0, that is an empty set has a probability of 0.
  For each subset A (A ⊂ Ω), A is called an event.
  P(A) = probability of A, where 0 < P(A) ≤ 1.
  For any element ω (ω ∈ Ω), ω is called an atomic event.
  P(ω) = P({ω}), and where A = {ω₁,ω₂,...,ωₙ}, {ω₁,ω₂,...,ωₙ} ⊂ Ω.
  P(A) = P(ω₁) + P(ω₂) + ... + P(ωₙ).
  Complement event- all events that are not event in question.
  P(Aᶜ) = 1 - P(A), so P(Aᶜ) = P(Ω) - P(A).
  Disjoint events- events that do not have a common outcome.
  P(A or B) = P(A ⋃ B) = P(A) + P(B).
  P(A and B) = P(A ⋂ B) = 0.
  Intersection events- common outcomes in each event.
  P(A and B) = P(A ⋂ B) = P(A) * P(B).
  Union events- outomes are in either (logical or) event.
  P(A or B) = P(A ⋃ B) = P(A) + P(B) - P(A ⋂ B).
*/

/**
 * Let X be a random variable with a probability function defined by a
 * finite number of finite outcomes x₁,x₂,...,xₖ
 * each with its respective probability p₁,p₂,...,pₖ
 * e.g.
 *        x |  0  |  1  |  2  |  3  |
 * P(X = x) | 0.1 | 0.2 | 0.4 | 0.3 | 
 * Expectation of X (E[X]) or mean of random variable x (μₓ) is:
 *         k
 * E[X] =  ∑ xᵢpᵢ = x₁p₁ + x₂p₂ + ... + xₖpₖ
 *        i=1
 * e.g.
 * E[X] = 0 * 0.1 + 1 * 0.2 + 2 * 0.4 + 3 * 0.3
 *      = 1.9
 * Determine expected value of random outcome for a given probability space
 * {'x₁': p₁, 'x₂': p₂, ..., 'xₖ': pₖ}
 * @param  {Object} pSpace probability space for all potential outcomes
 * @return {number}        weighted average of all potential outcomes
 */
const expectedDiscreteValue = (pSpace) => {
  let retVal = BigNumber(0);
  for (let x in pSpace) {
    retVal = retVal.plus(BigNumber(x).multipliedBy(pSpace[x]));
  }

  return retVal.toNumber();
};

/*
  Binomial distribution models the number of k successes in n trials where each
  trial is independent (no possible outcome is removed from the set of possible
  outcomes in each trial). Binomial distribution is dependent on the binomial
  coefficient.

  For a discrete random variable X, it is a binomially distributed (X ~ B(n, p))
  if it satisfies the following 4 conditions:
  1. There is a fixed number of trials (n)
  2. Each trial has two possible outcomes: success (k) or failure
  3. The probability of success (p) is the same for each trial
  4. Trials are independent, meaning the outcome of one trial doesn't influence
     the outcome of another trial
 */

/* Binomial coefficients */

/**
 * ⎛n⎞        n!
 * ⎜ ⎟ =  ――――――――――
 * ⎝k⎠    k!(n - k)!
 * "n choose k":
 * binomial coefficent is the number of ways to choose unique k elements from a fixed
 * set of n elements
 * @param  {number} n total number of options
 * @param  {number} k subset of unique k elements from set of n options
 * @return {number}   possible number of ways to choose k elements from set of n elements
 */
const binomialCoefficient = (n, k) => {
  let numerator = forFact(n);
  let denominator = forFact(n-k) * forFact(k);

  return BigNumber(numerator).dividedBy(denominator).toNumber();
};

/**
 *  k    n + 1 - i
 *  Π   ――――――――――
 * i=1      i
 * "n choose k":
 * binomial coefficent is the number of ways to choose unique k elements from a fixed
 * set of n elements
 * @param  {number} n total number of options
 * @param  {number} k subset of unique k elements from set of n options
 * @return {number}   possible number of ways to choose k elements from set of n elements
 */
const binomialCoefficientMultiplicative = (n, k) => {
  let retVal = 1;
  for (let i = 1; i <= k; k++) {
    retVal = BigNumber(retVal).multiply((BigNumber(n).plus(1).minus(i)).dividedBy(i));
  }

  return retVal.toNumber();
};

/**
 * ⎛⎛n⎞⎞   ⎛ n + k - 1 ⎞
 * ⎜⎜ ⎟⎟ = ⎜           ⎟
 * ⎝⎝k⎠⎠   ⎝     k     ⎠
 * "n multichoose k":
 * multinomial coefficient is the number of ways to choose k elements with repeats
 * from a fixed set of n elements
 * "Out of 9 (n) flavors of icecream, how many combinations are there with
 * 3 (k) scoops, allowing for multiple scoops of each flavor?"
 * @param  {number} n options
 * @param  {number} k subset of potentially repeating elements from set of n options
 * @return {number}   possible number of ways to choose repeatable k elements from set of n elements
 */
const multisetCoefficient = (n, k) => {

  return binomialCoefficient(n + k - 1, k);
};

/**
 *            ⎛n⎞
 * P(X = k) = ⎜ ⎟pᵏ(1-p)ⁿ⁻ᵏ
 *            ⎝k⎠
 * Models probability of success or failure in experimental survey repeated
 * multiple times for getting exactly k successes in n trials
 * @param  {number} n fixed number of trials
 * @param  {number} k successes
 * @param  {number} p probability for k
 * @return {number}   probability of successes for k in n trials
 */
const binomialDistProbabilityMassFunc = (n, k, p) => {
  // number of outcomes for k successes in n trials
  let coeff = binomialCoefficient(n, k);
  // q is probability of failure, complement of p
  let q = 1.0 - p;
  let succ = exponentiate(p, k);
  let fail = exponentiate(q, (n - k));

  return coeff * succ * fail;
};

/**
 * ⎣k⎦ ⎛n⎞
 *  ∑  ⎜ ⎟ pⁱ(1-p)ⁿ⁻ⁱ
 * i=0 ⎝i⎠
 * The probability that that random-value X will take a value less than or equal to k
 * @param  {number} n fixed number of trials
 * @param  {number} k successes
 * @param  {number} p probability for k
 */
const binomialDistCumulativeDistFunc = (n, k, p) => {
  let retVal = 0;
  for (let i = 0; i <= k; i++) {
    retVal += binomialDistProbabilityMassFunc(n, i, p);
  }

  return retVal;
}

/* Dice-related functions */

/**
 *        kₘₐₓ     ⎛n⎞ ⎛p - s * k - 1⎞
 * 1/sⁿ *  ∑ (-1)ᵏ ⎜ ⎟ ⎜             ⎟
 *        k=0      ⎝k⎠ ⎝p - s * k - n⎠
 * kₘₐₓ =  ⎣p - n / s⎦
 * Generate probability that a sum p of n numbers for dice of s faces will occur
 * @param  {number} p target number in probability space (sum of dice result)
 * @param  {number} n number of dice
 * @param  {number} s number of sides of dice
 * @return {number}   probability of sum of dice given n and s
 */
const pOfSumInDice = (p, n, s) => {
  let kmax = Math.floor((p - n) / s);
  let sum = 0;
  for (let k = 0; k <= kmax; k++) {
    sum = BigNumber(sum).plus(exponentiate(-1, k) * binomialCoefficient(n, k) * binomialCoefficient((p - (s * k) - 1), (p - (s * k) - n)));
  }

  return BigNumber(1).dividedBy(exponentiate(s, n)).multipliedBy(sum).toNumber();
};

/**
 * Create probability space for sums of numbers of n dice with s number of sides
 * @param  {number} n number of dice
 * @param  {number} s number of sides of dice
 * @return {Object}   probability space for sums of n number of dice with s sides
 */
const probabilitySpace = (n, s) => {
  let sums = range(n, n * s);
  let pSums = sums.map((sum) => pOfSumInDice(sum, n, s));
  let retObj = {};
  sums.forEach((elem, idx) => retObj[`${elem}`] = pSums[idx]);

  return retObj;
};

// @XXX: TODO
// make function(s) that will generate a probability space from arrays of objects that describe discrete sample spaces
// [coin: {events: [H,T], number: 5}],
// [dice: {events; [1,2,3,4,5,6], number: 3}],
// [redMarbles: {events: [red], number: 3}, blueMarbles: {events: [blue], number: 4}]

/* Parsing data sets that are arrays of numbers */

/**
 * Average of all numbers in data array
 * @param  {Array}  [data=[]] integer or float data points
 * @return {number}           average number
 */
const mean = (data = []) => {
  const sum = data.reduce((accum, currVal) => BigNumber(accum).plus(currVal), 0);

  return sum.dividedBy(data.length).toNumber();
};

/**
 * Median value for array of data points
 * @param  {Array}  [data=[]] integer or float data points
 * @return {number}           median value
 */
const median = (data = []) => {
  let dataCln = data.slice();
  let len = data.length;
  let mid = Math.floor(len / 2);
  dataCln.sort((a, b) => a - b);
  if (len % 2 === 0) {
    return BigNumber(dataCln[mid - 1]).plus(dataCln[mid]).dividedBy(2).toNumber();
  } else {
    return dataCln[mid];
  }
};

/**
 * Most frequent value in a data set
 * @param  {Array}  [data=[]] integer or float data points
 * @return {number}           most frequent vale in data set
 */
const mode = (data = []) => {
  let counts = {};
  let hiCount = 0;
  let retVals = [];
  data.forEach((elem) => {
    if(counts[elem] !== undefined) {
      counts[elem] += 1;
      counts[elem] > hiCount ? hiCount = counts[elem] : hiCount;
    } else {
      counts[elem] = 1;
      counts[elem] > hiCount ? hiCount = counts[elem] : hiCount;
    }
  });
  for (let key in counts) {
    counts[key] === hiCount
      ? retVals.push(BigNumber(key).toNumber())
      : retVals;
  }

  return retVals.length > 1 ? retVals : retVals[0];
};

/**
 * Differences of data points from average
 * @param  {Array}  [data=[]] integer or float data points
 * @param  {number} avg       average for data points
 * @return {Array}            array of differences of data points and average
 */
const difference = (data = [], avg) => {
  const diff = data.map((currVal) => BigNumber(currVal).minus(avg).toNumber());

  return diff;
};

/**
 * Squared differences of data points from average
 * @param  {Array}  [data=[]] integer or float data points
 * @param  {number} avg       average for data points
 * @return {Array}             array of squared differences of data points from average
 */
const squareDiff = (data = [], avg) => {
  const diff = difference(data, avg);
  const sqrDiff = diff.map((currVal) => currVal.multipliedBy(currVal).toNumber());

  return sqrDiff;
};

/**
 * Measure of amount of variation of a set of values
 * @param  {Array}  [data=[]] integer or float data points
 * @return {number}           number that represents spread of values from mean
 */
const standardDeviation = (data = []) => {
  let sqrDiffs = squareDiff(data, mean(data));
  let avgSqrDiffs = mean(sqrDiffs);
  let stdDev = BigNumber(avgSqrDiffs).squareRoot().toNumber();

  return stdDev;
};

/**
 * The number of standard deviations a value is above or below the mean
 * @param  {number} val    any integer or float number data point of a data set
 * @param  {number} mean   average of the data set
 * @param  {number} stdDev measure of amount of variation within data set
 * @return {number}        number of standard deviations a value is above or below the mean
 */
const zScore = (val, mean, stdDev) => {
  let z = (BigNumber(val).minus(mean)) / BigNumber(stdDev);

  return z;
};

/**
 * Measure of statistical dispersion that is resiliant to outliers
 * @param  {Array}  [data=[]] integer or float data points
 * @return {number}           absolute deviations from median
 */
const medianAbsDev = (data = []) => {
  let med = median(data);
  let mad = median(data.map((elem) => {
    return BigNumber(elem).minus(med).absoluteValue().toNumber();
  }));

  return mad;
} ;

/**
 * The number of absolute deviations a value is above or below the median
 * @param  {number} val    any integer or float number data point of a data set
 * @param  {number} mean   average of the data set
 * @param  {number} mad    absolute deviations from median
 * @return {number}
 */
const modifiedZScore = (val, med, mad) => {
  let modZ = 0.6745 * BigNumber((val - med)).absoluteValue().dividedBy(mad).toNumber();

  return modZ;
};

/* Methods to remove outliers from data sets of numbers */

/**
 * Detect outliers from data set that have modified z-scores > 3.5
 * @param  {Array}  [data=[]] integer or float data points
 * @return {Array}            array filtered to remove potential outliers
 */
const robustZScore = (data = []) => {
  let dataSort = data.slice().sort((a, b) => a - b);
  let cutoff = 3.5;
  let med = median(data);
  let mad = medianAbsDev(data);
  let modZScores = dataSort.map((elem) => modifiedZScore(elem, med, mad));

  return dataSort.filter((elem, idx) => modZScores[idx] < cutoff);
};

/**
 * For larger data sets, remove top and bottom 2.5% of elements from sorted data set
 * @param  {Array}  [data=[]] integer or float data points
 * @return {Array}            array filtered to remove potential outliers
 */
const twoPointFive = (data = []) => {
  let dataSort = data.slice().sort((a, b) => a - b);
  let len = dataSort.length;
  let low = Math.round(len * 0.025);
  let high = len - low;

  return dataSort.slice(low, high);
};

/**
 * Remove elements that are greater than 3 standard deviations in value
 * @param  {Array}  [data=[]] integer or float data points
 * @return {Array}            array filtered to remove potential outliers
 */
const threeStdDev = (data = []) => {
  let dataSort = data.slice().sort((a, b) => a - b);
  let avg = mean(dataSort);
  let stdDev = standardDeviation(dataSort);

  return dataSort.filter((elem) => elem > avg - (3 * stdDev) && elem < avg + (3 * stdDev));
}

/**
 * Remove values that are significanty smaller than value at idx data.length/4
 * and values that are significantly greater than value at idx data.lengt/4 * 3
 * @param  {Array}  [data=[]] integer or float data points
 * @return {Array}            array filtered to remove potential outliers
 */
const interQuartRange = (data = []) => {
  let dataSort = data.slice().sort((a, b) => a - b);
  let mn = mean(dataSort);
  let md = median(dataSort);
  let lowerQuart = dataSort[Math.round(dataSort.length/4)];
  let upperQuart = dataSort[Math.round(3 * dataSort.length/4)];
  let interQuart = upperQuart - lowerQuart;

  return dataSort.filter((elem) => elem > md - (2 * interQuart) && elem < mn + (2 * interQuart));
};
