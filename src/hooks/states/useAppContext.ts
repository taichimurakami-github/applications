import { useContext } from "react";
import {
  AppSetStateContext,
  AppStateContext,
  AttendanceStateContext,
  ModalStateContext,
  SeatsStateContext,
  StudentsListContext,
} from "~/AppContainer";

// app states
export const useAppStateCtx = () => useContext(AppStateContext);
export const useAttendanceStateCtx = () => useContext(AttendanceStateContext);
export const useSeatsStateCtx = () => useContext(SeatsStateContext);
export const useStudentsListCtx = () => useContext(StudentsListContext);
export const useModalStateCtx = () => useContext(ModalStateContext);

// app state setters
export const useAppSetStateCtx = () => useContext(AppSetStateContext);
