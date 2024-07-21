"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "@/app/components/Header";
import Explore from "@/app/pages/Explore";
export default function explore() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <Explore />
    </DndProvider>
  );
}
