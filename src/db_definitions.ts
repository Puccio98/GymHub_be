/**
 * Naming convention:
 * Singular names for tables
 * Singular names for columns
 * Schema name for tables prefix (E.g.: SchemeName.TableName)
 * Pascal casing (a.k.a. upper camel case)
 */

module.exports.Exercise = require('./models/exercise');
module.exports.ExerciseWorkout = require('./models/exercise_workout');
module.exports.Program = require('./models/program');
module.exports.ProgramState = require('./models/programState');
module.exports.User = require('./models/user');
module.exports.Workout = require('./models/workout');
