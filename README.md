# Precisely: better assertions for JavaScript/TypeScript tests

Precisely allows you to write precise assertions so you only test the behaviour you're really interested in.
This makes it clearer to the reader what the expected behaviour is,
and makes tests less brittle.
This also allows better error messages to be generated when assertions fail.
Inspired by [Hamcrest](http://hamcrest.org).

For instance, suppose we want to make sure that a `unique` function removes duplicates from a list.
We might write a test like so:

```javascript
import { assertThat, containsExactly } from "@mwilliamson/precisely";

test("test unique() removes duplicates", () => {
    const result = unique(["a", "a", "b", "a", "b"]);

    assertThat(result, containsExactly("a", "b"));
});
```

The assertion will pass so long as `result` contains `"a"` and `"b"` in any order,
but no other items.
Unlike, say, `assert.deepStrictEqual(result, ["a", "b"])`, our assertion ignores the ordering of elements.
This is useful when:

* the ordering of the result is non-determistic,
  such as the results of SQL SELECT queries without an ORDER BY clause.

* the ordering isn't specified in the contract of `unique`.
  If we assert a particular ordering, then we'd be testing the implementation rather than the contract.

* the ordering is specified in the contract of `unique`,
  but the ordering is tested in a separate test case.

When the assertion fails,
rather than just stating the two values weren't equal,
the error message will describe the failure in more detail.
For instance, if `result` has the value `["a", "a", "b"]`,
we'd get the failure message:

```
Expected: iterable containing in any order:
  * 'a'
  * 'b'
but: had extra elements:
  * 'a'
```

## Installation

```
npm install @mwilliamson/precisely
```

## API

Use `assertThat(value, matcher)` to assert that a value satisfies a matcher.

Many matchers are composed of other matchers.
If they are given a value instead of a matcher,
then that value is wrapped in `equalTo()`.
For instance, `hasProperties({name: "bob"})` is equivalent to `hasProperties({name: equalTo("bob")})`.

* `equalTo(value)`: matches a value if it is equal to `value` using `===`.

* `deepEqualTo(value)`: matches a value if it is deeply strictly equal to `value`.

* `hasProperties(properties)`: matches a value if it has the specified properties.
  For instance:

  ```javascript
  assertThat(result, hasProperties({
      name: "The Princess Bride",
      authors: containsExactly(
          hasProperties({name: "William Goldman"}),
      ),
  }));
  ```

* `containsExactly(...elements)`: matches an iterable if it has the same elements in any order.
  For instance:

  ```javascript
  assertThat(result, containsExactly("a", "b"));
  // Matches ["a", "b"] and ["b", "a"],
  // but not ["a", "a", "b"] nor ["a"] nor ["a", "b", "c"]
  ```

* `isSequence(...elements)`: matches an iterable if it has the same elements in the same order.
  For instance:

  ```javascript
  assertThat(result, isSequence("a", "b"));
  // Matches ["a", "b"]
  // but not ["b", "a"] nor ["a", "b", "c"] nor ["c", "a", "b"]
  ```

* `includes(*args)`: matches an iterable if it includes all of the elements.
  For instance:

  ```javascript

  assertThat(result, includes("a", "b"));
  // Matches ["a", "b"], ["b", "a"] and ["a", "c", "b"]
  // but not ["a", "c"] nor ["a"]
  assertThat(result, includes("a", "a"));
  // Matches ["a", "a"] and ["a", "a", "a"]
  // but not ["a"]
  ```

* `anything`: matches all values.
