import React from "react"

interface StudentCategorySelector {
  backToTop: ()=>void,
  onSelect: (e: React.MouseEvent) => void,
  onSelectOthers: () => void
}

const StudentCategorySelector = React.forwardRef((props: StudentCategorySelector, ref:React.ForwardedRef<HTMLDivElement>) => {

  return (
    <div  className="component-select-student-data-wrapper">

      <h1>あなたの学年と名前を選んでください</h1>
      <p>
        まずは学年を選びましょう。その後、表示された名簿リストから、あなたの名前を選んでください。
      </p>
      <button onClick={props.backToTop} className="btn retry-btn btn__typeC">
        前のページに戻る
      </button>
      <div className="grade-selector" ref={ref}>
        <button onClick={props.onSelect} className="btn" id="middle-1">
          中学１年生
        </button>
        <button onClick={props.onSelect} className="btn" id="middle-2">
          中学２年生
        </button>
        <button onClick={props.onSelect} className="btn" id="middle-3">
          中学３年生
        </button>
        <button onClick={props.onSelect} className="btn" id="high-1">
          高校１年生
        </button>
        <button onClick={props.onSelect} className="btn" id="high-2">
          高校２年生
        </button>
        <button onClick={props.onSelect} className="btn" id="high-3">
          高校３年生
        </button>
        <button onClick={props.onSelect} className="btn" id="elementary-1">
          小学１年生
        </button>
        <button onClick={props.onSelect} className="btn" id="elementary-2">
          小学２年生
        </button>
        <button onClick={props.onSelect} className="btn" id="elementary-3">
          小学３年生
        </button>
        <button onClick={props.onSelect} className="btn" id="elementary-4">
          小学４年生
        </button>
        <button onClick={props.onSelect} className="btn" id="elementary-5">
          小学５年生
        </button>
        <button onClick={props.onSelect} className="btn" id="elementary-6">
          小学６年生
        </button>
        <button onClick={props.onSelectOthers} className="btn" id="others">
          その他関係者
        </button>
      </div>

    </div>
  )

})

export default StudentCategorySelector;