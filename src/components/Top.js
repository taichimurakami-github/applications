import { useRef } from "react";

export const Top = (props) => {

  const closeBtn = useRef();

  const handleEnter = (e) => {
    // console.log("now selected: ", e.target);

    if(props.studentsList === null) return;

    //activeの席をクリックしたときは何もしない
    if (props.seatsState[e.target.id].active) return;
    // e.target.classList.add("active");

    props.onHandleAppState({ selectedElement: e.target, selectedSeat: e.target.id, now: "STUDENT" });
  }

  const handleConfig = () => {
    props.onHandleAppState({
      now: "CONFIG"
    })
  }

  const displayExitModal = () => {
    props.onHandleModalState({
      active: true,
      name: "EXIT",
      content: {
        studentsList: props.studentsList,
        seatsState: props.seatsState,
      }
    });
  }

  return (
    <>
      {
        (props.studentsList === null) ?
        <>
          <h1>現在、入出登録ができません。</h1>
          <p>生徒情報が読み込まれていません。</p>
          <p>設定画面を開き、生徒情報ファイルを読み込んでください。</p>
        </>

        :

        <>
          <h1>使用する座席を選んでください</h1>
          <p>下に表示されている緑色の席の中から、使用する席を選んでクリックしてください。</p>
          <p>自習室を退出する際は、下の「退出する」ボタンを押してください。</p>
        </>
      }
      <div  className={props.studentsList === null ? "seat-table-container unactive" : "seat-table-container"}>
        <ul className={"column"}>
          <li id="seat13" className={props.seatsState.seat13.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat13.active ? "使用不可" : 13}</li>
          <li id="seat14" className={props.seatsState.seat14.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat14.active ? "使用不可" : 14}</li>
          <li id="seat15" className={props.seatsState.seat15.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat15.active ? "使用不可" : 15}</li>
          <li id="seat16" className={props.seatsState.seat16.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat16.active ? "使用不可" : 16}</li>
        </ul>
        <ul className={"column"}>
          <li id="seat9" className={props.seatsState.seat9.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat9.active ? "使用不可" : 9}</li>
          <li id="seat10" className={props.seatsState.seat10.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat10.active ? "使用不可" : 10}</li>
          <li id="seat11" className={props.seatsState.seat11.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat11.active ? "使用不可" : 11}</li>
          <li id="seat12" className={props.seatsState.seat12.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat12.active ? "使用不可" : 12}</li>
        </ul>

        <ul className={"column"}>
          <li id="seat5" className={props.seatsState.seat5.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat5.active ? "使用不可" : 5}</li>
          <li id="seat6" className={props.seatsState.seat6.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat6.active ? "使用不可" : 6}</li>
          <li id="seat7" className={props.seatsState.seat7.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat7.active ? "使用不可" : 7}</li>
          <li id="seat8" className={props.seatsState.seat8.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat8.active ? "使用不可" : 8}</li>
        </ul>

        <ul className={"column"}>
          <li id="seat1" className={props.seatsState.seat1.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat1.active ? "使用不可" : 1}</li>
          <li id="seat2" className={props.seatsState.seat2.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat2.active ? "使用不可" : 2}</li>
          <li id="seat3" className={props.seatsState.seat3.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat3.active ? "使用不可" : 3}</li>
          <li id="seat4" className={props.seatsState.seat4.active ? "active" : undefined} onClick={handleEnter}>{props.seatsState.seat4.active ? "使用不可" : 4}</li>
        </ul>


      </div>
      <button className="btn activate-exit-btn btn__typeA" onClick={displayExitModal} disabled={(props.studentsList === null)}>退出する</button>
      <button className="btn btn__typeC" onClick={handleConfig}>設定画面を開く</button>
    </>
  )
}