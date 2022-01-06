import Airtable from "airtable";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  search_param,
  search_result,
  setSearchParam,
  setSearchResult,
} from "./features/appSlice";
import { Dictionary } from "./utils";
import "./App.css";

const base = new Airtable({ apiKey: "keyxmHMm2d0FiirQ6" }).base(
  "app8ZbcPx7dkpOnP0"
);

export default function SearchStudent() {
  const dispatch = useAppDispatch();
  const _param = useAppSelector(search_param);
  const _result = useAppSelector(search_result);

  const findStudent = () => {
    base("Students")
      .select({
        filterByFormula: `{Name} = '${_param}'`,
        view: "Grid view",
      })
      .eachPage(
        function page(records) {
          const results: any = records[0].get("Classes");
          let filterString = "OR(RECORD_ID() = '";
          filterString += results.join("', RECORD_ID() = '");
          filterString.replace("RECORD_ID() = ''", "");
          filterString += "')";
          findClasses(filterString);
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  };

  const findClasses = (filterParam: string) => {
    base("Classes")
      .select({
        filterByFormula: filterParam,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          let filterString = "OR(RECORD_ID() = '";
          const classRecords: Dictionary = new Dictionary();
          records.forEach((_r) => {
            const _record: any = _r.get("Students");
            classRecords.set(_r.id, {
              students: _record.join(","),
              name: "" + _r.get("Name"),
              id: _r.id,
              _students: [],
            });
            filterString += _record.join("', RECORD_ID() = '");
          });
          filterString.replace("RECORD_ID() = ''", "");
          filterString += "')";
          mergeResults(filterString, classRecords);
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  };

  const mergeResults = (filterParam: string, classRecords: Dictionary) => {
    base("Students")
      .select({
        filterByFormula: filterParam,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach((_r) => {
            const classes: any = _r.get("Classes");
            classes.forEach((_c: string) => {
              if (classRecords.containsKey(_c)) {
                const _record = classRecords.get(_c);
                _record._students.push({
                  student_id: _r.id,
                  student_name: _r.get("Name"),
                });
                classRecords.set(_c, _record);
              }
            });
          });
          dispatch(setSearchResult(classRecords.getValues()));
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  };

  return _result.length === 0 ? (
    <section id="search-student">
      <div style={{ display: "flex" }}>
        <label>Students Name:</label>
        <input onChange={(e) => dispatch(setSearchParam(e.target.value))} />
      </div>
      <button onClick={findStudent}>
        <label>Login</label>
      </button>
    </section>
  ) : (
    <section id="list-classes">
      {_result.map((record: any, index: number) => {
        return (
          <div key={index} className="list-item">
            <h3>Name</h3>
            <p>{record.name}</p>
            <h3>Students</h3>
            <div className="student-list">
              {record._students.map((students: any, index: number) => {
                return <p key={index}>{students.student_name}</p>;
              })}
            </div>
          </div>
        );
      })}
      <button
        onClick={() => {
          dispatch(setSearchParam(""));
          dispatch(setSearchResult([]));
        }}
      >
        <label>Log Out</label>
      </button>
    </section>
  );
}