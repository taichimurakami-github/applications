
/**
 * 
 * @param {object} props
 * {
 *    seatsState: App.jsのseatsState
 *    props.onClickFunction: onClick時の実行関数
 * }
 * 
 *  
 * @returns 
 */
interface SeatsTableProps {
  seatsState: seatsState,
  onClickFunction: (e: any) => void
}
const SeatsTable: React.VFC<SeatsTableProps> = (props) => {
  return (
    <div className="seat-table-container">
      <ul className={"column"}>
        <li id="seat13" className={props.seatsState.seat13.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat13.active ? "使用中" : 13}</li>
        <li id="seat14" className={props.seatsState.seat14.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat14.active ? "使用中" : 14}</li>
        <li id="seat15" className={props.seatsState.seat15.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat15.active ? "使用中" : 15}</li>
        <li id="seat16" className={props.seatsState.seat16.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat16.active ? "使用中" : 16}</li>
      </ul>
      <ul className={"column"}>
        <li id="seat9" className={props.seatsState.seat9.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat9.active ? "使用中" : 9}</li>
        <li id="seat10" className={props.seatsState.seat10.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat10.active ? "使用中" : 10}</li>
        <li id="seat11" className={props.seatsState.seat11.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat11.active ? "使用中" : 11}</li>
        <li id="seat12" className={props.seatsState.seat12.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat12.active ? "使用中" : 12}</li>
      </ul>

      <ul className={"column"}>
        <li id="seat5" className={props.seatsState.seat5.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat5.active ? "使用中" : 5}</li>
        <li id="seat6" className={props.seatsState.seat6.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat6.active ? "使用中" : 6}</li>
        <li id="seat7" className={props.seatsState.seat7.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat7.active ? "使用中" : 7}</li>
        <li id="seat8" className={props.seatsState.seat8.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat8.active ? "使用中" : 8}</li>
      </ul>

      <ul className={"column"}>
        <li id="seat1" className={props.seatsState.seat1.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat1.active ? "使用中" : 1}</li>
        <li id="seat2" className={props.seatsState.seat2.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat2.active ? "使用中" : 2}</li>
        <li id="seat3" className={props.seatsState.seat3.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat3.active ? "使用中" : 3}</li>
        <li id="seat4" className={props.seatsState.seat4.active ? "active" : undefined} onClick={props.onClickFunction}>{props.seatsState.seat4.active ? "使用中" : 4}</li>
      </ul>
    </div>
  )
}

export { SeatsTable }