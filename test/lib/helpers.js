'use strict';

const expect = require('chai').use(require('sinon-chai')).use(require('dirty-chai')).expect;
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const helpers = require('../../src/lib/helpers');

describe('helpers', () => {

  beforeEach(() => {
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getQuestion', () => {
    it('recognises the short key', () => {
      expect(helpers.getQuestion({ q: 'foo' })).to.equal('foo');
    });

    it('recognises the long key', () => {
      expect(helpers.getQuestion({ question: 'foo' })).to.equal('foo');
    });

    it('returns null for bad data', () => {
      expect(helpers.getQuestion()).to.be.null();
    });
  });

  describe('getAnswer', () => {
    it('recognises transformed questions', () => {
      expect(helpers.getAnswer({ answer: 'foo' })).to.equal('foo');
    });

    it('recognises object style question', () => {
      expect(helpers.getAnswer({ answers: ['bar', 'etc'] })).to.equal('bar');
    });

    it('recognises the short key', () => {
      expect(helpers.getAnswer({ a: ['bar', 'etc'] })).to.equal('bar');
    });

    it('returns null for bad data', () => {
      expect(helpers.getAnswer()).to.be.null();
    });
  });

  describe('getWrongAnswers', () => {
    it('only recognises object style question', () => {
      expect(helpers.getWrongAnswers({ answers: ['bar', 'etc'] })).to.deep.equal(['etc']);
      expect(helpers.getWrongAnswers({ answers: ['bar', 'baz', 'etc'] })).to.deep.equal(['baz', 'etc']);
    });

    it('returns an empty array for bad data', () => {
      expect(helpers.getWrongAnswers()).to.be.an('array').and.have.length(0);
    });
  });

  describe('answerIsSame', () => {
    it('only recognises object style question', () => {
      expect(helpers.answerIsSame({ answers: ['bar'] }, { answers: ['bar'] })).to.be.true();
      expect(helpers.answerIsSame({ answers: ['foo'] }, { answers: ['bar'] })).to.be.false();
    });

    it('is ok with bad data', () => {
      expect(helpers.answerIsSame()).to.be.true();
      expect(helpers.answerIsSame(null)).to.be.true();
      expect(helpers.answerIsSame(null, null)).to.be.true();
    });
  });

  describe('randomWrongAnswer', () => {

    beforeEach(() => {
      sandbox.stub(helpers, 'getWrongAnswers');
      sandbox.stub(Math, 'random').returns(0);
    });

    it('returns null for no question', () => {
      expect(helpers.randomWrongAnswer()).to.be.null();
      expect(Math.random).not.to.be.called();
    });

    it('returns null for no wrong answer', () => {
      helpers.getWrongAnswers.returns([]);
      expect(helpers.randomWrongAnswer({})).to.be.null();
      expect(Math.random).not.to.be.called();
    });

    describe('one misleading answer', () => {
      it('returns the answer if there is one', () => {
        helpers.getWrongAnswers.returns(['foo']);
        expect(helpers.randomWrongAnswer('dummy')).to.equal('foo');
        expect(Math.random).to.be.calledOnce();
      });
    });

    describe('more than one misleading answer', () => {
      it('returns first answer if random is low', () => {
        helpers.getWrongAnswers.returns(['foo', 'bar']);
        Math.random.returns(0);
        expect(helpers.randomWrongAnswer('dummy')).to.equal('foo');
        expect(Math.random).to.be.calledOnce();
      });

      it('returns last answer if random is high', () => {
        Math.random.returns(0.9);
        helpers.getWrongAnswers.returns(['foo', 'bar']);
        expect(helpers.randomWrongAnswer('dummy')).to.equal('bar');
        expect(Math.random).to.be.calledOnce();
      });

      it('returns 2nd answer if random is in 2nd quarter', () => {
        helpers.getWrongAnswers.returns(['one', 'two', 'three', 'four']);
        Math.random.returns(0.26);
        expect(helpers.randomWrongAnswer('dummy')).to.equal('two');
        expect(Math.random).to.be.calledOnce();
      });

      it('returns 3rd answer if random is in 3rd quarter', () => {
        helpers.getWrongAnswers.returns(['one', 'two', 'three', 'four']);
        Math.random.returns(0.6);
        expect(helpers.randomWrongAnswer('dummy')).to.equal('three');
        expect(Math.random).to.be.calledOnce();
      });

    });

  });

  describe('getYear', () => {

    it('returns null for a non number', () => {
      expect(helpers.getYear('foo')).to.be.null();
    });

    it('returns null for a small number', () => {
      expect(helpers.getYear({ question: '99' })).to.be.null();
    });

    it('returns null for a big number', () => {
      expect(helpers.getYear({ question: '10000' })).to.be.null();
    });

    it('identifies a 3 digit year', () => {
      expect(helpers.getYear({ question: '999' })).to.equal(999);
    });

    it('identifies a 4 digit year', () => {
      expect(helpers.getYear({ question: '9999' })).to.equal(9999);
    });
  });

  describe('firstChars', () => {

    beforeEach(() => {
      sandbox.stub(helpers, 'getAnswer').returns('null');
    });

    it('is ok with duff data', () => {
      expect(helpers.firstChars()).to.equal('null');
    });

    it('truncates and lowercases', () => {
      helpers.getAnswer.returns('PIE');
      expect(helpers.firstChars('dummy', 3)).to.equal('pie');
      expect(helpers.firstChars('dummy', 2)).to.equal('pi');
    });

    it('strips out lower case short initial words like a, an, the, er, sie, est', () => {
      helpers.getAnswer.returns('a pie');
      expect(helpers.firstChars('dummy', 3)).to.equal('pie');
      helpers.getAnswer.returns('ab pie');
      expect(helpers.firstChars('dummy', 3)).to.equal('pie');
      helpers.getAnswer.returns('abc pie');
      expect(helpers.firstChars('dummy', 3)).to.equal('pie');
    });

    it('does not strip out capitalised short initial words like The', () => {
      helpers.getAnswer.returns('A pie');
      expect(helpers.firstChars({ answer: 'A pie' }, 3)).to.equal('a p');
      helpers.getAnswer.returns('AB pie');
      expect(helpers.firstChars({ answer: 'AB pie' }, 3)).to.equal('ab ');
      helpers.getAnswer.returns('ABC pie');
      expect(helpers.firstChars({ answer: 'ABC pie' }, 3)).to.equal('abc');
    });

  });

  describe('buildQuestion', () => {

    let questions = null;

    beforeEach(() => {
      questions = [
        { question: 'foo', trivia: 'triv 0' },
        { question: 'foo' }
      ];
      sandbox.stub(helpers, 'pickMultipleChoiceAnswers').returns('etc');
      sandbox.stub(helpers, 'getAnswer').returns('bar');
    });

    it('picks a question', () => {
      const expected = {
        id: 0,
        question: 'foo',
        trivia: 'triv 0',
        answer: 'bar',
        answers: 'etc'
      };
      expect(helpers.buildQuestion(0, questions)).to.deep.equal(expected);
    });

    it('only populates trivia if present', () => {
      const expected = {
        id: 1,
        question: 'foo',
        answer: 'bar',
        answers: 'etc'
      };
      expect(helpers.buildQuestion(1, questions)).to.deep.equal(expected);
    });

  });

  describe('pickMultipleChoiceAnswers', () => {

    const questions = [{ answer: 'foo' }];
    const question = { answer: 'bar' };

    beforeEach(() => {
      sandbox.stub(helpers, 'randomWrongAnswer');
      sandbox.stub(helpers, 'answerIsSimilar').returns(true);
    });

    describe('with no random wrong answer', () => {
      beforeEach(() => {
        helpers.randomWrongAnswer.returns(null);
      });

      it('returns an array of options', () => {
        const sorted = helpers.pickMultipleChoiceAnswers(question, questions, 3).sort();
        expect(sorted).to.deep.equal(['bar', 'foo', 'foo']);
      });
    });

    describe('without a random wrong answer', () => {
      beforeEach(() => {
        helpers.randomWrongAnswer.returns('etc');
      });

      it('returns an array of options', () => {
        const sorted = helpers.pickMultipleChoiceAnswers(question, questions, 3).sort();
        expect(sorted).to.deep.equal(['bar', 'etc', 'foo']);
      });
    });
  });

  describe('getTags', () => {
    it('returns an array with no params', () => {
      expect(helpers.getTags()).to.be.an('array').and.have.length(0);
    });

    it('identifies tags', () => {
      const questions = [
        {
          tags: ['foo']
        },
        {},
        {
          tags: ['foo', 'bar']
        }
      ];
      const expected = [
        { tag: 'bar', value: null },
        { tag: 'foo', value: null }
      ];
      expect(helpers.getTags(questions)).to.deep.equal(expected);
    });

    it('merges chosen values with tags', () => {
      const options = { foo: 1, bar: 2 };
      const questions = [
        {
          tags: ['foo']
        },
        {
          tags: ['bar']
        }
      ];
      const expected = [
        { tag: 'bar', value: 2 },
        { tag: 'foo', value: 1 }
      ];
      expect(helpers.getTags(questions, options)).to.deep.equal(expected);
    });

  });

});
