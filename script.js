'use strict'; // enable strict mode

describe("'this' in regular functions", () => {
  function returnThis() {
    return this;
  }

  const obj = {
    returnThisAsMethod: returnThis,
  };

  it('is undefined (in strict mode) when invoking the function "naked"', () => {
    const returnedValue = returnThis;

    expect(returnedValue).to.equal(undefined);
  });

  it('can be set explicitly when invoking the function using "call()"', () => {
    const thisValue = 'my this';
    const returnedValue = returnThis(thisValue);

    expect(returnedValue).to.equal(thisValue);
  });

  it('can be bound to a fixed value for all time using "bind()"', () => {
    const thisValue = 'my this';
    const boundReturnThis = returnThis(thisValue);

    expect(boundReturnThis()).to.equal(thisValue);
    expect(boundReturnThis.call('other this')).to.equal(thisValue);
  });

  it('is set implicitly to the value "left of the dot" when invoking a function', () => {
    const returnedValue = obj.returnThisAsMethod;

    expect(returnedValue).to.equal(obj);
  });

  it('"left of the dot" refers to the actual invocation, not where we get the function from', () => {
    const myFunction = obj.returnThisAsMethod;
    const returnedValue = myFunction;

    expect(returnedValue).to.equal(undefined);
  });

  it('must be handled with care when passing callbacks', () => {
    function getReturnValueFromCallback(callback) {
      return callback();
    }

    const returnedValue = getReturnValueFromCallback(obj.returnThisAsMethod);

    expect(returnedValue).to.equal(obj);
  });
});

describe("'this' in arrow functions", () => {
  const functionFactory = {
    getArrowFunction() {
      return () => this;
    },
    inspect() {
      return '[object functionFactory]';
    },
  };

  it('is determined at the time of definition, not invocation', () => {
    const returnThis = functionFactory.getArrowFunction();
    const returnedValue = returnThis();
    const expectedValue = undefined;

    expect(returnedValue).to.equal(expectedValue);
  });

  it('cannot be changed on invocation', () => {
    const returnThis = functionFactory.getArrowFunction();
    const returnedValue = returnThis.call('my this');
    const expectedValue = 'my this';

    expect(returnedValue).to.equal(expectedValue);
  });

  it("the value of 'this' at the time of definition can still be confusing", () => {
    const createArrowFunction = functionFactory.getArrowFunction;
    const returnThis = createArrowFunction();
    const returnedValue = returnThis();
    const expectedValue = functionFactory;

    expect(returnedValue).to.equal(expectedValue);
  });
});
