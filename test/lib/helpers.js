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
    it('recognises array style question', () => {
      expect(helpers.getQuestion(['foo', 'bar'])).to.equal('foo');
    });

    it('recognises object style question', () => {
      expect(helpers.getQuestion({ question: 'foo' })).to.equal('foo');
    });

    it('returns null for bad data', () => {
      expect(helpers.getQuestion()).to.be.null();
    });
  });

  describe('getAnswer', () => {
    it('recognises array style question', () => {
      expect(helpers.getAnswer(['foo', 'bar'])).to.equal('bar');
    });

    it('recognises object style question', () => {
      expect(helpers.getAnswer({ answers: ['bar', 'etc'] })).to.equal('bar');
    });

    it('returns null for bad data', () => {
      expect(helpers.getAnswer()).to.be.null();
    });
  });

  describe('getWrongAnswers', () => {
    it('recognises array style question', () => {
      expect(helpers.getWrongAnswers(['foo', 'bar', 'etc'])).to.deep.equal(['etc']);
      expect(helpers.getWrongAnswers(['foo', 'bar', 'baz', 'etc'])).to.deep.equal(['baz', 'etc']);
    });

    it('recognises object style question', () => {
      expect(helpers.getWrongAnswers({ answers: ['bar', 'etc'] })).to.deep.equal(['etc']);
      expect(helpers.getWrongAnswers({ answers: ['bar', 'baz', 'etc'] })).to.deep.equal(['baz', 'etc']);
    });

    it('returns an empty array for bad data', () => {
      expect(helpers.getWrongAnswers()).to.be.an('array').and.have.length(0);
    });
  });

  describe('answerIsSame', () => {
    it('recognises array style question', () => {
      expect(helpers.answerIsSame(['foo', 'bar'], ['etc', 'bar'])).to.be.true();
      expect(helpers.answerIsSame(['foo', 'bar'], ['etc', 'baz'])).to.be.false();
    });

    it('recognises object style question', () => {
      expect(helpers.getAnswer({ answers: ['bar', 'etc'] })).to.equal('bar');
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
      sandbox.stub(Math, 'random').returns(0);
    });

    it('returns null for no question', () => {
      expect(helpers.randomWrongAnswer()).to.be.null();
      expect(Math.random).not.to.be.called();
    });

    it('returns null for no wrong answer', () => {
      expect(helpers.randomWrongAnswer(['foo', 'bar'])).to.be.null();
      expect(Math.random).not.to.be.called();
    });

    describe('one misleading answer', () => {
      it('returns the answer if there is one', () => {
        expect(helpers.randomWrongAnswer(['foo', 'bar', 'baz'])).to.equal('baz');
        expect(Math.random).to.be.calledOnce();
      });
    });

    describe('more than one misleading answer', () => {
      it('returns first answer if random is low', () => {
        Math.random.returns(0);
        expect(helpers.randomWrongAnswer(['foo', 'bar', 'baz', 'etc'])).to.equal('baz');
        expect(Math.random).to.be.calledOnce();
      });

      it('returns last answer if random is high', () => {
        Math.random.returns(0.9);
        expect(helpers.randomWrongAnswer(['foo', 'bar', 'baz', 'etc'])).to.equal('etc');
        expect(Math.random).to.be.calledOnce();
      });

      it('returns 2nd answer if random is in 2nd quarter', () => {
        Math.random.returns(0.26);
        expect(helpers.randomWrongAnswer(['foo', 'bar', 'one', 'two', 'three', 'four'])).to.equal('two');
        expect(Math.random).to.be.calledOnce();
      });

      it('returns 3rd answer if random is in 3rd quarter', () => {
        Math.random.returns(0.6);
        expect(helpers.randomWrongAnswer(['foo', 'bar', 'one', 'two', 'three', 'four'])).to.equal('three');
        expect(Math.random).to.be.calledOnce();
      });

    });

  });

  describe('getYear', () => {

    beforeEach(() => {
      sandbox.stub(helpers, 'getQuestion');
    });

    it('returns null for a non number', () => {
      helpers.getQuestion.returns('foo');
      expect(helpers.getYear()).to.be.null();
    });

    it('returns null for a small number', () => {
      helpers.getQuestion.returns('99');
      expect(helpers.getYear()).to.be.null();
    });

    it('returns null for a big number', () => {
      helpers.getQuestion.returns('10000');
      expect(helpers.getYear()).to.be.null();
    });

    it('identifies a 3 digit year', () => {
      helpers.getQuestion.returns('999');
      expect(helpers.getYear()).to.equal(999);
    });

    it('identifies a 4 digit year', () => {
      helpers.getQuestion.returns('9999');
      expect(helpers.getYear()).to.equal(9999);
    });
  });

  describe('firstChars', () => {

    beforeEach(() => {
      sandbox.stub(helpers, 'getAnswer');
    });

    it('is ok with duff data', () => {
      helpers.getAnswer.returns(null);
      expect(helpers.firstChars()).to.equal('null');
    });

    it('truncates and lowercases', () => {
      helpers.getAnswer.returns('PIE');
      expect(helpers.firstChars('dummy', 3)).to.equal('pie');
      helpers.getAnswer.returns('PIE');
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
      expect(helpers.firstChars('dummy', 3)).to.equal('a p');
      helpers.getAnswer.returns('AB pie');
      expect(helpers.firstChars('dummy', 3)).to.equal('ab ');
      helpers.getAnswer.returns('ABC pie');
      expect(helpers.firstChars('dummy', 3)).to.equal('abc');
    });

  });

  describe('buildQuestion', () => {

    let questions = null;

    beforeEach(() => {
      questions = [
        { trivia: 'triv 0' },
        { }
      ];
      sandbox.stub(helpers, 'getQuestion').returns('foo');
      sandbox.stub(helpers, 'getAnswer').returns('bar');
      sandbox.stub(helpers, 'pickMultipleChoiceAnswers').returns('etc');
    });

    it('picks a question', () => {
      const expected = {
        id: 0,
        question: 'foo',
        answer: 'bar',
        answers: 'etc',
        trivia: 'triv 0'
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

    const questions = [{ answers: ['bar'] }];
    const question = { answer: 'foo' };

    beforeEach(() => {
      sandbox.spy(helpers, 'getAnswer');
      sandbox.stub(helpers, 'randomWrongAnswer').returns(null);
      sandbox.stub(helpers, 'answerIsSimilar').returns(true);
    });

    describe('with no random wrong answer', () => {
      it('returns an array of options', () => {
        const sorted = helpers.pickMultipleChoiceAnswers(question, questions, 3).sort();
        expect(sorted).to.deep.equal(['bar', 'bar', 'foo']);
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

});
