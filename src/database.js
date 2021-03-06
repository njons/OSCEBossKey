// TODO: handle errors better

require("dotenv").config();
const Airtable = require("airtable");
const functions = require("./utils/airtableReturns");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY
});

const database = Airtable.base("apprDMfzlKustw8Ol");

const queries = {
  getSectionStations: (res, section) => {
    database(`${section}_Stations`)
      .select()
      .firstPage((err, records) => {
        if (err) functions.returnEmptyPayload(res, err);
        else {
          const stations = [];
          records.forEach(record => {
            stations.push(record.get("station_name"));
          });
          functions.returnPopulatedPayload(res, stations);
        }
      });
  },
  getStation: (res, station) => {
    database("History_Stations")
      .select({
        fields: ["primary_key"],
        filterByFormula: `({station_name} = '${station}')`
      })
      .firstPage((err, record) => {
        if (err || record.length === 0)
          return functions.returnEmptyPayload(res, err);
        return functions.returnPopulatedPayload(res, record[0].id);
      });
  },
  getCases: (res, station) => {
    const caseTitles = [];
    database("History_Stations")
      .select({
        fields: ["primary_key"],
        filterByFormula: `({station_name} = '${station}')`
      })
      .firstPage((err, record) => {
        if (err || record.length === 0) functions.returnEmptyPayload(res, err);
        else {
          database("History_Cases")
            .select({
              fields: ["case_title", "primary_key"],
              filterByFormula: `({station_id} = ${record[0].get(
                "primary_key"
              )})`
            })
            .eachPage(
              (records, fetchNextPage) => {
                records.forEach(record => {
                  caseTitles.push({
                    title: record.get("case_title"),
                    id: record.get("primary_key")
                  });
                });
                fetchNextPage();
              },
              err => {
                if (err) functions.returnEmptyPayload(res, err);
                functions.returnPopulatedPayload(res, caseTitles);
              }
            );
        }
      });
  },
  getSingleCase: (res, caseId) => {
    database("History_Cases")
      .select({
        fields: ["case_title", "case_details", "mark_scheme"],
        filterByFormula: `({primary_key} = '${caseId}')`
      })
      .firstPage((err, record) => {
        if (err || record.length === 0)
          functions.returnEmptyPayload(res, err, {});
        else {
          functions.returnPopulatedPayload(res, {
            title: record[0].get("case_title"),
            details: record[0].get("case_details"),
            mark_scheme: [...record[0].get("mark_scheme").split(", ")]
          });
        }
      });
  },
  getMarkScheme: res => {
    const markSchemeArray = [];
    database("History_Mark_Scheme_Elements")
      .select({
        fields: ["mark_scheme_elements"]
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(record =>
            markSchemeArray.push(record.get("mark_scheme_elements"))
          );
          fetchNextPage();
        },
        err => {
          if (err || markSchemeArray.length === 0)
            return functions.returnEmptyPayload(res, err);
          return functions.returnPopulatedPayload(res, markSchemeArray);
        }
      );
  },
  addStation: station => {
    database("History_Stations").create(
      {
        station_name: station
      },
      err => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  },
  addCase: (station, title, details, markScheme) => {
    database("History_Cases").create(
      {
        station_id: [station],
        case_title: title,
        case_details: details,
        mark_scheme: markScheme
      },
      err => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  },
  addMarkSchemeElement: element => {
    database("History_Mark_Scheme_Elements").create(
      {
        mark_scheme_elements: element
      },
      err => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  }
};

module.exports = queries;
