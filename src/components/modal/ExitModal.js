import { appConfig } from "../../app.config";

const ExitModal = (props) => {

  const handleExit = (e) => {
    // console.log(e.target.id);
    // props.onSaveForExit(e.target.id);
    props.onHandleModalState({
      active: true,
      name: appConfig.modalCodeList["1001"],
      content: {
        confirmCode: appConfig.confirmCodeList["1002"],
        targetID: e.target.id,
      }
    });
  }

  const generateStudentsList = () => {
    const seats = props.seatsState;
    const activeSeatList = [];
    const othersList = [];

    //active状態の席IDを配列に格納
    for (let key in props.seatsState) {
      //埋まっている席番号を格納
      seats[key].active && activeSeatList.push(key);
      
      //関係者がいたら別配列でも監視
      seats[key].studentID === "__OTHERS__" && othersList.push(key);
    }

    if(activeSeatList[0]){
    //active状態の席一つひとつに対し、
    //その席に登録されている生徒IDからstudentsListを検索し、該当する要素を返す
      return activeSeatList.map((val) => {
        let result;

        //関係者が存在したら
        if(seats[val].studentID === "__OTHERS__"){
          result = [{
            id: "__OTHERS__",
            name: "関係者等(記録されません)",
            school: null,
            grade: null,
            belongs: null
          }]
        }
        else{
          //生徒IDが一致する生徒情報をデータシートのデータより取得
          result = props.studentsList.filter(elem => {
            return elem.id == seats[val].studentID;
          })
        }
        
        return <li onClick={handleExit} id={val} className="active-seat-user">
          <span>席番号：{val.slice(4)}</span>
          <span>お名前：{result[0].name}</span>
        </li>
      });
    }
    else{
      //activeSeatsが存在しない
      return <li className="no-close">現在使用されている席はありません。</li>
    }

  };

  return (
    <ul className="exit-modal-container">
      {generateStudentsList()}
    </ul>
  )
}

export {ExitModal};