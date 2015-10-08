
'use strict';

var expect = require('expect.js');
var DateUtils = require('../index.js');

describe('DateUtils - isDateTimeWithinRange', function() {
  var dateRange = {
    startDateTime: new Date('2015-06-10 00:00:00'),
    endDateTime: new Date('2015-06-15 23:59:59')
  };

  it('DateUtils.isDateTimeWithinRange returns true when date is inside of range', function() {
    expect(DateUtils.isDateTimeWithinRange(new Date('2015-06-12 13:00:00'), dateRange)).to.be.ok();
  });
  it('DateUtils.isDateTimeWithinRange returns false when date is outside of range', function() {
    expect(DateUtils.isDateTimeWithinRange(new Date('2015-06-16 13:00:00'), dateRange)).to.not.be.ok();
  });
  it('DateUtils.isDateTimeWithinRange returns false when date equal to startDateTime', function() {
    expect(DateUtils.isDateTimeWithinRange(new Date('2015-06-10 00:00:00'), dateRange)).to.be.ok();
  });
  it('DateUtils.isDateTimeWithinRange returns false when date equal to endDateTime', function() {
    expect(DateUtils.isDateTimeWithinRange(new Date('2015-06-15 23:59:59'), dateRange)).to.be.ok();
  });
});

describe('DateUtils - generateDateRangeFromGap', function() {
  var listOfRanges = [
    {
      startDateTime: new Date('2015-06-10 00:00:00'),
      endDateTime: new Date('2015-06-15 23:59:59')
    },
    {
      startDateTime: new Date('2015-06-16 00:00:01'),
      endDateTime: new Date('2015-06-18 23:59:59')
    }
  ];

  it('DateUtils.generateDateRangeFromGap returns null when there is no gap of dates', function() {
    var gapRange = DateUtils.generateDateRangeFromGap(listOfRanges, {
      startDateTime: new Date('2015-06-17 00:00:01'),
      endDateTime: new Date('2015-06-18 23:59:58')
    });
    expect(gapRange).to.eql(null);
  });
  it('DateUtils.generateDateRangeFromGap returns the supplied range when [   ] [   ] < >', function() {
    var gapRange = DateUtils.generateDateRangeFromGap(listOfRanges, {
      startDateTime: new Date('2015-06-18 23:59:59'),
      endDateTime: new Date('2015-06-19 23:59:58')
    });
    expect(gapRange).to.eql({
      startDateTime: new Date('2015-06-18 23:59:59'),
      endDateTime: new Date('2015-06-19 23:59:58')
    });
  });
  it('DateUtils.generateDateRangeFromGap returns the inner gap when ranges cover like [  <]  [  > ]', function() {
    var gapRange = DateUtils.generateDateRangeFromGap(listOfRanges, {
      startDateTime: new Date('2015-06-11 00:00:00'),
      endDateTime: new Date('2015-06-18 23:59:59')
    });
    expect(gapRange).to.eql({
      startDateTime: new Date('2015-06-15 23:59:59'),
      endDateTime: new Date('2015-06-16 00:00:01')
    });
  });
  it('DateUtils.generateDateRangeFromGap returns the outer gap when ranges cover like [   ] [  <]  >', function() {
    var gapRange = DateUtils.generateDateRangeFromGap(listOfRanges, {
      startDateTime: new Date('2015-06-18 00:00:01'),
      endDateTime: new Date('2015-06-19 23:59:59')
    });
    expect(gapRange).to.eql({
      startDateTime: new Date('2015-06-18 23:59:59'),
      endDateTime: new Date('2015-06-19 23:59:59')
    });
  });
  it('DateUtils.generateDateRangeFromGap returns the supplied range when < [   ] [   ] >', function() {
    var gapRange = DateUtils.generateDateRangeFromGap(listOfRanges, {
      startDateTime: new Date('2015-06-09 00:00:00'),
      endDateTime: new Date('2015-06-20 23:59:59')
    });
    expect(gapRange).to.eql({
      startDateTime: new Date('2015-06-09 00:00:00'),
      endDateTime: new Date('2015-06-20 23:59:59')
    });
  });
});

describe('DateUtils - consolidateDateTimeRanges', function() {
  it('DateUtils.consolidateDateTimeRanges returns what was provided to it when there are no overlaps', function() {
    var dateRangeList = [
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-15 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-16 00:00:01'),
        endDateTime: new Date('2015-06-18 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-20 00:00:01'),
        endDateTime: new Date('2015-06-22 23:59:59')
      }
    ];
    expect(DateUtils.consolidateDateTimeRanges(dateRangeList)).to.eql(dateRangeList);
  });
  it('DateUtils.consolidateDateTimeRanges consolidates 2 date ranges when they overlap', function() {
    var dateRangeList = [
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-15 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-15 00:00:01'),
        endDateTime: new Date('2015-06-18 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-20 00:00:01'),
        endDateTime: new Date('2015-06-22 23:59:59')
      }
    ];
    var expectedResultsList = [
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-18 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-20 00:00:01'),
        endDateTime: new Date('2015-06-22 23:59:59')
      }
    ];
    expect(DateUtils.consolidateDateTimeRanges(dateRangeList)).to.eql(expectedResultsList);
  });
  it('DateUtils.consolidateDateTimeRanges consolidates 3 date ranges when they overlap', function() {
    var dateRangeList = [
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-15 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-15 00:00:01'),
        endDateTime: new Date('2015-06-20 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-20 00:00:01'),
        endDateTime: new Date('2015-06-22 23:59:59')
      }
    ];
    var expectedResultsList = [
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-22 23:59:59')
      }
    ];
    expect(DateUtils.consolidateDateTimeRanges(dateRangeList)).to.eql(expectedResultsList);
  });
  it('DateUtils.consolidateDateTimeRanges consolidates 3 out of order date ranges when they overlap', function() {
    var dateRangeList = [
      {
        startDateTime: new Date('2015-06-20 00:00:01'),
        endDateTime: new Date('2015-06-22 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-15 23:59:59')
      },
      {
        startDateTime: new Date('2015-06-15 00:00:01'),
        endDateTime: new Date('2015-06-20 23:59:59')
      }
    ];
    var expectedResultsList = [
      {
        startDateTime: new Date('2015-06-10 00:00:00'),
        endDateTime: new Date('2015-06-22 23:59:59')
      }
    ];
    expect(DateUtils.consolidateDateTimeRanges(dateRangeList)).to.eql(expectedResultsList);
  });
});

