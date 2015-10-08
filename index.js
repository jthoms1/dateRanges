'use strict';

var moment = require('moment');

/*
 * A dateTimeRange consists of an object containing a startDate and endDate.
 * {
 *   startDateTime: dateObject,
 *   endDateTime: dateObject
 * }
 */

function consolidateDateTimeRanges(arrayOfRanges) {
  return arrayOfRanges.sort(function(drA, drB) {
      var dateA = moment(drA.startDateTime).format('X');
      var dateB = moment(drB.startDateTime).format('X');

      return dateA - dateB;
    })
    .reduce(function(fullList, dateRangeB) {
      for (var i = 0; i < fullList.length; i += 1) {
        var dateRangeA = fullList[i];

        var startDateWithinRangeA = isDateTimeWithinRange(dateRangeB.startDateTime, dateRangeA);
        var endDateWithinRangeA = isDateTimeWithinRange(dateRangeB.endDateTime, dateRangeA);

        // If the Range B is completely within Range A then do not add Range B back to the list
        if (startDateWithinRangeA && endDateWithinRangeA) {
          return fullList;
        }

        // If the Range B's start date is within Range A then change Range A's end date
        // to that of Range B and do not add Range B back to the list
        if (startDateWithinRangeA && !endDateWithinRangeA) {
          dateRangeA.endDateTime = dateRangeB.endDateTime;
          return fullList;
        }

        // If the Range B's end date is within Range A then change Range A's start date
        // to that of Range B and do not add Range B back to the list
        if (!startDateWithinRangeA && endDateWithinRangeA) {
          dateRangeA.startDateTime = dateRangeB.startDateTime;
          return fullList;
        }
      }

      // If Range B does not relate any current Ranges add it to the list.
      fullList.push(dateRangeB);
      return fullList;
    }, []);
}

function generateDateRangeFromGap(arrayOfRanges, dateRangeB) {
  for (var i = 0; i < arrayOfRanges.length; i += 1) {
    var dateRangeA = arrayOfRanges[i];

    var startDateWithinRangeA = isDateTimeWithinRange(dateRangeB.startDateTime, dateRangeA);
    var endDateWithinRangeA = isDateTimeWithinRange(dateRangeB.endDateTime, dateRangeA);

    // If the Range B is completely within Range A then no Gap exists
    if (startDateWithinRangeA && endDateWithinRangeA) {
      return null;
    }

    // If the Range B is completely within Range A then no Gap exists
    if (startDateWithinRangeA && !endDateWithinRangeA) {
      dateRangeB.startDateTime = dateRangeA.endDateTime;
    }

    // If the Range B is completely within Range A then no Gap exists
    if (!startDateWithinRangeA && endDateWithinRangeA) {
      dateRangeB.endDateTime = dateRangeA.startDateTime;
    }
  }
  return dateRangeB;
}

// Checks if the date is equal to the startDateTime/endDateTime or within them
function isDateTimeWithinRange(dateTime, dateRange) {
  var mDate = moment(dateTime);

  return mDate.isBetween(dateRange.startDateTime, dateRange.endDateTime) ||
    mDate.isSame(dateRange.startDateTime) ||
    mDate.isSame(dateRange.endDateTime);
}

module.exports = {
  consolidateDateTimeRanges: consolidateDateTimeRanges,
  generateDateRangeFromGap: generateDateRangeFromGap,
  isDateTimeWithinRange: isDateTimeWithinRange
};
