import "../css/player.scss";
import React from "react";
// import Chapter from "../content/chapter1";
import * as allContent from "../content/chapter1";

function importAll(r) {
  let allFiles = {};
  r.keys().map((item, index) => {
    allFiles[item.replace("./", "")] = r(item);
  });
  return allFiles;
}

const allAudio = importAll(require.context("../audio", false, /\.(mp3)$/));

// console.log(allContent.Chapter1);

class Player extends React.Component {
  state = {
    index: 3,
    currentTime: "0:00",
    audioList: [
      {
        name: "道德经",
        author: "",
        audio: allAudio["0.mp3"],
        duration: "0:14",
      },
      {
        name: "第一章",
        author: "",
        audio: allAudio["1.mp3"],
        duration: "0:33",
      },
      {
        name: "第二章",
        author: "",
        audio: allAudio["2.mp3"],
        duration: "0:45",
      },
      {
        name: "第三章",
        author: "",
        audio: allAudio["3.mp3"],
        duration: "0:34",
      },
      {
        name: "Slow cinematic",
        author: "author",
        img: "https://www.bensound.com/bensound-img/slowmotion.jpg",
        audio:
          "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
        duration: "3:26",
      },
    ],
    pause: false,
  };

  componentDidMount() {
    this.playerRef.addEventListener("timeupdate", this.timeUpdate, false);
    this.playerRef.addEventListener("ended", this.nextSong, false);
    this.timelineRef.addEventListener("click", this.changeCurrentTime, false);
    this.timelineRef.addEventListener("mousemove", this.hoverTimeLine, false);
    this.timelineRef.addEventListener("mouseout", this.resetTimeLine, false);
  }

  componentWillUnmount() {
    this.playerRef.removeEventListener("timeupdate", this.timeUpdate);
    this.playerRef.removeEventListener("ended", this.nextSong);
    this.timelineRef.removeEventListener("click", this.changeCurrentTime);
    this.timelineRef.removeEventListener("mousemove", this.hoverTimeLine);
    this.timelineRef.removeEventListener("mouseout", this.resetTimeLine);
  }

  hoverTimeLine = (e) => {
    const duration = this.playerRef.duration;

    const playheadWidth = this.timelineRef.offsetWidth;

    const offsetWidht = this.timelineRef.offsetLeft;
    const userClickWidht = e.clientX - offsetWidht;
    const userClickWidhtInPercent = (userClickWidht * 100) / playheadWidth;

    if (userClickWidhtInPercent <= 100) {
      this.hoverPlayheadRef.style.width = userClickWidhtInPercent + "%";
    }

    const time = (duration * userClickWidhtInPercent) / 100;

    if (time >= 0 && time <= duration) {
      this.hoverPlayheadRef.dataset.content = this.formatTime(time);
    }
  };

  changeCurrentTime = (e) => {
    const duration = this.playerRef.duration;

    const playheadWidth = this.timelineRef.offsetWidth;
    const offsetWidht = this.timelineRef.offsetLeft;
    const userClickWidht = e.clientX - offsetWidht;

    const userClickWidhtInPercent = (userClickWidht * 100) / playheadWidth;

    this.playheadRef.style.width = userClickWidhtInPercent + "%";
    this.playerRef.currentTime = (duration * userClickWidhtInPercent) / 100;
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

  translateText = () => {
    const { index } = this.state;
    const currentChapter = `Chapter${index}`;
    const Content = allContent[currentChapter];

    console.log("you clicked!", currentChapter);

    const x = document.getElementById("img-wrap");
    console.log("html:", x.innerHTML);
    if (x.innerHTML === "Hello") {
      x.innerHTML = "Swapped text!";
    } else {
      x.innerHTML = "Hello";
    }
  };

  render() {
    const { audioList, index, currentTime, pause } = this.state;
    const currentTrack = audioList[index];
    const currentChapter = `Chapter${index}`;
    const Content = allContent[currentChapter];

    return (
      <div className="card">
        <div className="current-song">
          <audio ref={(ref) => (this.playerRef = ref)}>
            <source src={currentTrack.audio} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
          <div className="img-wrap" onClick={this.translateText}>
            Hello
            {/* <div id="myDIV"><Content /></div> */}
          </div>
          <span className="song-name">{currentTrack.name}</span>
          <span className="song-autor">{currentTrack.author}</span>

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
            <button
              onClick={this.prevSong}
              className="prev prev-next current-btn"
            >
              <i className="fas fa-backward"></i>
            </button>

            <button onClick={this.playOrPause} className="play current-btn">
              {!pause ? (
                <i className="fas fa-play"></i>
              ) : (
                <i className="fas fa-pause"></i>
              )}
            </button>
            <button
              onClick={this.nextSong}
              className="next prev-next current-btn"
            >
              <i className="fas fa-forward"></i>
            </button>
          </div>
        </div>
        <div className="play-list">
          {audioList.map((music, key = 0) => (
            <div
              key={key}
              onClick={() => this.clickAudio(key)}
              className={
                "track " +
                (index === key && !pause ? "current-audio" : "") +
                (index === key && pause ? "play-now" : "")
              }
            >
              <img className="track-img" src={music.img} />
              <div className="track-discr">
                <span className="track-name">{music.name}</span>
                <span className="track-author">{music.author}</span>
              </div>
              <span className="track-duration">
                {index === key ? currentTime : music.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Player;
