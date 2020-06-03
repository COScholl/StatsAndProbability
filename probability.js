const BigNumber = require('bignumber.js');

/* Working with probability and probability space */

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
 * ⎛n⎞        n!
 * ⎜ ⎟ =  ――――――――――
 * ⎝k⎠    k!(n - k)!
 * "n choose k":
 * n = total number of trials
 * k = target number for success
 * "Out of 3 (n) tosses, what are the chances of 2 (k) heads?"
 * This does not allow for repetitions
 * @param  {[type]} n [description]
 * @param  {[type]} k [description]
 * @return {[type]}   [description]
 */
const binomialCoefficient = (n, k) => {
  let numerator = forFact(n);
  let denominator = forFact(n-k) *  forFact(k);

  return BigNumber(numerator).dividedBy(denominator).toNumber();
};

/**
 * ⎛⎛n⎞⎞   ⎛ n + k - 1 ⎞
 * ⎜⎜ ⎟⎟ = ⎜           ⎟
 * ⎝⎝k⎠⎠   ⎝     k     ⎠
 * "n multichoose k":
 * @param  {[type]} n [description]
 * @param  {[type]} k [description]
 * @return {[type]}   [description]
 */
const multisetCoefficient = (n, k) => {

  return binomialCoefficient(n + k - 1, k);
};

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

/**
 * Create probability space for sums of numbers of n dice with s number of sides
 * @param  {number} n number of dice
 * @param  {number} s number of sides of dice
 * @return {Object}   probability space for sums of n number of dice with s sides
 */
const pForAllSumsInDice = (n, s) => {
  let sums = range(n, n * s);
  let pSums = sums.map((sum) => pOfSumInDice(sum, n, s));
  let retObj = {};
  sums.forEach((elem, idx) => retObj[`${elem}`] = pSums[idx]);

  return retObj;
};

/**
 *                                    ⎛n⎞
 * f(k,n,p) = Pr(k;n,p) = Pr(X = k) = ⎜ ⎟pᵏ(1-p)ⁿ⁻ᵏ
 *                                    ⎝k⎠
 * Models probability of success or failure in experimental survey repeated
 * multiple times
 * @param  {number} n number of trials
 * @param  {number} k successes
 * @param  {number} p probability for k
 * @return {number}   probability of successes for k in n trials
 */
const binomialDistribution = (n, k, p) => {
  // number of outcomes for k successes in n trials
  let coeff = binomialCoefficient(n, k);
  // q is probability of failure, complement of p
  let q = 1.0 - p;
  let succ = exponentiate(p, k);
  let fail = exponentiate(q, (n - k));

  return coeff * succ * fail;
};

/**
 * Determine expected value of random outcome for a given probability space
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

// console.log(twoPointFive([3,3,4,4,5,6,7,104]));

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

console.log(interQuartRange([3,3,4,4,5,6,7,104]));
