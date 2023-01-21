
const table =
{"A": 0.084966,
 "B": 0.020720,
 "C": 0.045388,
 "D": 0.033844,
 "E": 0.0111607,
 "F": 0.018121,
 "G": 0.024705,
 "H": 0.030034,
 "I": 0.075448,
 "J": 0.001965,
 "K": 0.011016,
 "L": 0.054893,
 "M": 0.030129,
 "N": 0.066544,
 "O": 0.071635,
 "P": 0.031671,
 "Q": 0.001962,
 "R": 0.075809,
 "S": 0.057351,
 "T": 0.069509,
 "U": 0.036308,
 "V": 0.010074,
 "W": 0.012899,
 "X": 0.002902,
 "Y": 0.017779,
 "Z": 0.002722
}

var bins = create_bins_from_probability_weights({
 table_of_probs: table,
 population_size: 1000
})

var array_of_values = create_population_from_bins({
 bins : bins
})


function create_bins_from_probability_weights(options) {
 const res = {};
 Object.keys(options.table_of_probs).forEach(function(key) {
     var prob = options.table_of_probs[key];
     var bin_size = (prob * options.population_size);
     res[key] = bin_size;
 })
 return (res)
}

function create_population_from_bins(options) {
 const res = [];
 Object.keys(options.bins).forEach(function(key) {
     for(var i = 0; i < options.bins[key]; i++) {
         res.push(key);
     }
 })
 return (res)
}

function random_sample_from_alphabet(options) {

 const res = options.array[(Math.floor(Math.random() * options.array.length))];

 return (res)
}
