assert = require('assert');
const actions = require('../src/actions/index.js');

// The (strictly synchronous) action creators are trivial to test, so we omit them.

// Reducer tests.
// describe('todos reducer', function() {
//     it('is initialized correctly', function() {
//         let expected = actions.addTodo(undefined);
//
//         assert.equal(expected.type, 'ADD_TODO');
//         assert.equal(expected.id, 0);
//     });
// });
