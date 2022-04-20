// Music: https://www.bensound.com
import React, { useState, useEffect } from "react";
import backgroundMusic1 from "../assets/music/bensound-dreams.mp3";
import backgroundMusic2 from "../assets/music/bensound-creativeminds.mp3";
import backgroundMusic3 from "../assets/music/victoryz.mp3";

import styles from "./AudioPlayer.module.css";

const useAudio = () => {
  console.log("In useAudio");
  let audioRecords = [backgroundMusic1, backgroundMusic2, backgroundMusic3];

  let randomMusicSelectionIndex = Math.floor(Math.random() * 3);
  console.log(
    "number: ",
    randomMusicSelectionIndex,
    audioRecords[randomMusicSelectionIndex]
  );
  const [audio] = useState(new Audio(audioRecords[randomMusicSelectionIndex]));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const AudioPlayer = () => {
  const [playing, toggle] = useAudio();

  return (
    <div>
      <button className={styles.play_button} onClick={toggle}>
        {playing ? "Pause Music" : "Play Music"}
      </button>
    </div>
  );
};

export default AudioPlayer;

// AudioPlayer Credits, Stack Overflow, @Thomas Hennes
// https://stackoverflow.com/questions/47686345/playing-sound-in-react-js
