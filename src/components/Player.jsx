import "../css/player.scss";
import React from "react";
import * as allContent from "../content/chapters";
import { marked } from "marked";

function importAll(r) {
  let allFiles = {};
  r.keys().map((item, index) => {
    allFiles[item.replace("./", "")] = r(item);
  });
  return allFiles;
}

const allAudio = importAll(require.context("../audio", false, /\.(mp3)$/));

class Player extends React.Component {
  state = {
    index: 0,
    currentTime: "0:00",
    audioList: [
      {
        name: "道德经",
        audio: allAudio["0.mp3"],
        duration: "0:14",
      },
      {
        name: "第一章",
        audio: allAudio["1.mp3"],
        duration: "0:33",
      },
      {
        name: "第二章",
        audio: allAudio["2.mp3"],
        duration: "0:45",
      },
      {
        name: "第三章",
        audio: allAudio["3.mp3"],
        duration: "0:34",
      },
      {
        name: "第十四章",
        audio: allAudio["14.mp3"],
        duration: "0:45",
      },
      {
        name: "第十五章",
        audio: allAudio["15.mp3"],
        duration: "0:46",
      },
      {
        name: "第十六章",
        audio: allAudio["16.mp3"],
        duration: "0:37",
      },
    ],
    pause: false,
    translation: false,
  };

  componentDidMount() {
    this.playerRef.addEventListener("timeupdate", this.timeUpdate, false);
    this.playerRef.addEventListener("ended", this.nextSong, false);
    this.timelineRef.addEventListener("click", this.changeCurrentTime, false);
    this.timelineRef.addEventListener("mousemove", this.hoverTimeLine, false);
    this.timelineRef.addEventListener("mouseout", this.resetTimeLine, false);
    // this.timelineRef.addEventListener("fetch", this.fetchText, false);
  }

  componentWillUnmount() {
    this.playerRef.removeEventListener("timeupdate", this.timeUpdate);
    this.playerRef.removeEventListener("ended", this.nextSong);
    this.timelineRef.removeEventListener("click", this.changeCurrentTime);
    this.timelineRef.removeEventListener("mousemove", this.hoverTimeLine);
    this.timelineRef.removeEventListener("mouseout", this.resetTimeLine);
    // this.timelineRef.removeEventListener("fetch", this.fetchText);
  }

  hoverTimeLine = (e) => {
    const duration = this.playerRef.duration;
    const playheadWidth = this.timelineRef.offsetWidth;
    const offsetWidth = this.timelineRef.offsetLeft;
    const userClickWidht = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidht * 100) / playheadWidth;
    if (userClickWidthInPercent <= 100) {
      this.hoverPlayheadRef.style.width = userClickWidthInPercent + "%";
    }
    const time = (duration * userClickWidthInPercent) / 100;
    if (time >= 0 && time <= duration) {
      this.hoverPlayheadRef.dataset.content = this.formatTime(time);
    }
  };

  changeCurrentTime = (e) => {
    const duration = this.playerRef.duration;
    const playheadWidth = this.timelineRef.offsetWidth;
    const offsetWidth = this.timelineRef.offsetLeft;
    const userClickWidht = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidht * 100) / playheadWidth;
    this.playheadRef.style.width = userClickWidthInPercent + "%";
    this.playerRef.currentTime = (duration * userClickWidthInPercent) / 100;
  };

  resetTimeLine = () => {
    this.hoverPlayheadRef.style.width = 0;
  };

  timeUpdate = () => {
    const duration = this.playerRef.duration;
    const timelineWidth =
      this.timelineRef.offsetWidth - this.playheadRef.offsetWidth;
    const playPercent = 100 * (this.playerRef.currentTime / duration);
    this.playheadRef.style.width = playPercent + "%";
    const currentTime = this.formatTime(parseInt(this.playerRef.currentTime));
    this.setState({
      currentTime,
    });
  };

  formatTime = (currentTime) => {
    const minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    seconds = seconds >= 10 ? seconds : "0" + (seconds % 60);
    const formatTime = minutes + ":" + seconds;
    return formatTime;
  };

  updatePlayer = () => {
    const { audioList, index } = this.state;
    const currentTrack = audioList[index];
    const audio = new Audio(currentTrack.audio);
    this.playerRef.load();
  };

  nextSong = () => {
    const { audioList, index, pause } = this.state;
    this.setState({
      index: (index + 1) % audioList.length,
    });
    this.updatePlayer();
    if (pause) {
      this.playerRef.play();
    }
  };

  prevSong = () => {
    const { audioList, index, pause } = this.state;
    this.setState({
      index: (index + audioList.length - 1) % audioList.length,
    });
    this.updatePlayer();
    if (pause) {
      this.playerRef.play();
    }
  };

  playOrPause = () => {
    const { audioList, index, pause } = this.state;
    const currentTrack = audioList[index];
    const audio = new Audio(currentTrack.audio);
    if (!this.state.pause) {
      this.playerRef.play();
    } else {
      this.playerRef.pause();
    }
    this.setState({
      pause: !pause,
    });
  };

  clickAudio = (key) => {
    const { pause } = this.state;
    this.setState({
      index: key,
    });
    this.updatePlayer();
    if (pause) {
      this.playerRef.play();
    }
  };

  fetchText = () => {
    const { index } = this.state;
    const mandarinText = require(`../content/english/${index}.md`);
    const englishText = require(`../content/mandarin/${index}.md`);
    fetch(mandarinText)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        this.setState({
          mandarin: marked(text),
        });
      });
    fetch(englishText)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        this.setState({
          english: marked(text),
        });
      });
  };

  toggleText = () => {
    const { translation } = this.state;
    this.setState({
      translation: !translation,
    });
  };

  render() {
    const {
      audioList,
      index,
      currentTime,
      pause,
      english,
      mandarin,
      translation,
    } = this.state;
    const currentTrack = audioList[index];
    // const currentChapter = translation ? `Chapter${index}T` : `Chapter${index}`;
    // const Content = allContent[currentChapter];
    this.fetchText();
    const textContent = translation ? mandarin : english;

    return (
      <div className="card">
        <div className="current-track">
          <audio ref={(ref) => (this.playerRef = ref)}>
            <source src={currentTrack.audio} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
          <div className="text-wrap" onClick={this.toggleText}>
            <article
              dangerouslySetInnerHTML={{ __html: textContent }}
            ></article>
          </div>
          <span className="track-name">{currentTrack.name}</span>
          <div className="time">
            <div className="current-time">{currentTime}</div>
            <div className="end-time">{currentTrack.duration}</div>
          </div>
          <div ref={(ref) => (this.timelineRef = ref)} id="timeline">
            <div ref={(ref) => (this.playheadRef = ref)} id="playhead"></div>
            <div
              ref={(ref) => (this.hoverPlayheadRef = ref)}
              className="hover-playhead"
              data-content="0:00"
            ></div>
          </div>
          <div className="controls">
            <button onClick={this.prevSong} className="prev prev current-btn">
              <i className="fas fa-backward"></i>
            </button>
            <button onClick={this.playOrPause} className="play current-btn">
              {!pause ? (
                <i className="fas fa-play"></i>
              ) : (
                <i className="fas fa-pause"></i>
              )}
            </button>
            <button onClick={this.nextSong} className="next next current-btn">
              <i className="fas fa-forward"></i>
            </button>
          </div>
        </div>
        <div className="play-list">
          {audioList.map((track, key = 0) => (
            <div
              key={key}
              onClick={() => this.clickAudio(key)}
              className={
                "track " +
                (index === key && !pause ? "current-audio" : "") +
                (index === key && pause ? "play-now" : "")
              }
            >
              <div className="track-discr">
                <span className="track-name">{track.name}</span>
              </div>
              <span className="track-duration">
                {index === key ? currentTime : track.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Player;
