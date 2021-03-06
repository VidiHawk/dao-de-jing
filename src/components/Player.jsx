import React from "react";
import { marked } from "marked";
import Switch from "./Switch";
import AudioList from "../utils/AudioList";
import "../css/Player.scss";

function importAllFiles(r) {
  let allFiles = {};
  r.keys().map((item, index) => (allFiles[item.replace("./", "")] = r(item)));
  return allFiles;
}

const allAudioFiles = importAllFiles(
  require.context("../audio", false, /\.(mp3)$/)
);

const infoText = [];

function fetchInfo(arg) {
  const importedText = require(`../content/${arg}.md`);
  fetch(importedText)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      infoText.push(marked(text));
    });
}

fetchInfo("english/info");
fetchInfo("mandarin/info");

class Player extends React.Component {
  state = {
    index: 0,
    currentTime: "00:00",
    audioList: AudioList,
    pause: false,
    translation: false,
    info: false,
    settings: false,
  };

  componentDidMount() {
    this.playerRef.addEventListener("timeupdate", this.timeUpdate, false);
    this.playerRef.addEventListener("ended", this.whenTrackEnds, false);
    this.timelineRef.addEventListener("click", this.changeCurrentTime, false);
    this.timelineRef.addEventListener("mousemove", this.hoverTimeLine, false);
    this.timelineRef.addEventListener("mouseout", this.resetTimeLine, false);
    this.updatePlayer();
  }

  componentWillUnmount() {
    this.playerRef.removeEventListener("timeupdate", this.timeUpdate);
    this.playerRef.removeEventListener("ended", this.whenTrackEnds);
    this.timelineRef.removeEventListener("click", this.changeCurrentTime);
    this.timelineRef.removeEventListener("mousemove", this.hoverTimeLine);
    this.timelineRef.removeEventListener("mouseout", this.resetTimeLine);
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
    const userClickWidth = e.clientX - offsetWidth;
    const userClickWidthInPercent = (userClickWidth * 100) / playheadWidth;
    this.playheadRef.style.width = userClickWidthInPercent + "%";
    this.playerRef.currentTime = (duration * userClickWidthInPercent) / 100;
  };

  resetTimeLine = () => {
    this.hoverPlayheadRef.style.width = 0;
  };

  timeUpdate = () => {
    const duration = this.playerRef.duration;
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
    const formatTime = `${minutes}0:${seconds}`;
    return formatTime;
  };

  updatePlayer = () => {
    const index = localStorage.getItem("index")
      ? JSON.parse(localStorage.getItem("index"))
      : 0;
    this.playerRef.src = allAudioFiles[`${index}.mp3`];
    this.playerRef.load();
    const playItem = document.getElementById("track" + index);
    playItem.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  backFive = () => {
    const newTime = this.playerRef.currentTime - 5;
    this.playerRef.currentTime = newTime;
  };

  forwardFive = () => {
    const newTime = this.playerRef.currentTime + 5;
    this.playerRef.currentTime = newTime;
  };

  nextTrack = () => {
    const index = localStorage.getItem("index")
      ? JSON.parse(localStorage.getItem("index"))
      : 0;
    const { audioList, pause } = this.state;
    const newIndex = (index + 1) % audioList.length;
    this.fetchText(newIndex);
    localStorage.setItem("index", JSON.stringify(newIndex));
    this.updatePlayer();
    if (pause) {
      this.playerRef.play();
    }
  };

  whenTrackEnds = () => {
    const stop = localStorage.getItem("stop")
      ? JSON.parse(localStorage.getItem("stop"))
      : false;
    const loop = localStorage.getItem("loop")
      ? JSON.parse(localStorage.getItem("loop"))
      : false;
    if (stop) {
      this.playerRef.pause();
      this.setState({
        pause: false,
      });
    }
    if (loop && !stop) {
      this.playerRef.play();
    }
    if (!stop && !loop) {
      this.nextTrack();
      this.setState({
        pause: true,
      });
    }
  };

  playOrPause = () => {
    const index = localStorage.getItem("index")
      ? JSON.parse(localStorage.getItem("index"))
      : 0;
    const { pause } = this.state;
    this.fetchText(index);
    if (!this.state.pause) {
      this.playerRef.play();
    } else {
      this.playerRef.pause();
    }
    this.setState({
      pause: !pause,
      info: false,
      settings: false,
    });
    const playItem = document.getElementById("track" + index);
    playItem.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  clickAudio = (key) => {
    const clickNplay = localStorage.getItem("clickNplay")
      ? JSON.parse(localStorage.getItem("clickNplay"))
      : true;
    const { pause } = this.state;
    this.setState({
      index: key,
      info: false,
      settings: false,
    });
    localStorage.setItem("index", JSON.stringify(key));
    this.fetchText(key);
    this.updatePlayer();
    if (!pause && clickNplay) {
      this.setState({
        pause: !pause,
      });
      this.playerRef.play();
    }
    if ((!pause && !clickNplay) || (pause && !clickNplay)) {
      this.setState({
        pause: false,
      });
    }
    if (pause && clickNplay) {
      this.playerRef.play();
    }
  };

  infoApp = () => {
    const { pause, translation } = this.state;
    if (translation) {
      this.setState({
        translation: !translation,
      });
    }
    this.setState({
      mandarin: infoText[0],
      english: infoText[1],
      info: true,
      settings: false,
    });
    if (pause) {
      this.playerRef.pause();
      this.setState({
        pause: !pause,
      });
    }
  };

  settingsContent = (stop, clickNplay, loop) => {
    return (
      <>
        <div className="text-card-settings">
          <h2>Settings</h2>
          <div className="item-switch-container">
            <div className="item">Pause at the end of a track</div>
            <div className="switch">
              <Switch
                name="stop"
                isOn={stop}
                handleToggle={() => {
                  localStorage.setItem("stop", JSON.stringify(!stop));
                  if (!stop) {
                    localStorage.setItem("loop", JSON.stringify(false));
                  }
                }}
              />
            </div>
          </div>
          <div className="item-switch-container">
            <div className="item">Play a track when clicking on it</div>
            <div className="switch">
              <Switch
                name="clickNplay"
                isOn={clickNplay}
                handleToggle={() =>
                  localStorage.setItem(
                    "clickNplay",
                    JSON.stringify(!clickNplay)
                  )
                }
              />
            </div>
          </div>
          <div className="item-switch-container">
            <div className="item">Play track in a loop</div>
            <div className="switch">
              <Switch
                name="loop"
                isOn={loop}
                handleToggle={() => {
                  localStorage.setItem("loop", JSON.stringify(!loop));
                  if (!loop) {
                    localStorage.setItem("stop", JSON.stringify(false));
                  }
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  settingsOpen = () => {
    const { pause } = this.state;
    if (pause) {
      this.playerRef.pause();
      this.setState({
        pause: !pause,
      });
    }
    this.setState({
      settings: true,
    });
  };

  fetchText = (index) => {
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

  textContent = () => {
    const { translation, settings, mandarin, english } = this.state;
    if (settings) {
      const content = this.settingsContent();
      return content;
    } else {
      const content = translation ? mandarin : english;
      return content;
    }
  };

  htmlContent = () => {
    const textContent = this.textContent();
    const cardStyle = this.cardStyle();
    return (
      <article
        className={cardStyle}
        dangerouslySetInnerHTML={{ __html: textContent }}
      ></article>
    );
  };

  cardStyle = () => {
    const { translation, info } = this.state;
    if (info) {
      return "text-card-info";
    }
    if (!translation) {
      return "text-card-chinese";
    } else {
      return "text-card-english";
    }
  };

  toggleText = () => {
    const { translation } = this.state;
    this.setState({
      translation: !translation,
    });
  };

  render() {
    const { audioList, currentTime, pause, english, settings } = this.state;

    const index = localStorage.getItem("index")
      ? JSON.parse(localStorage.getItem("index"))
      : 0;
    const stop = localStorage.getItem("stop")
      ? JSON.parse(localStorage.getItem("stop"))
      : false;
    const clickNplay = localStorage.getItem("clickNplay")
      ? JSON.parse(localStorage.getItem("clickNplay"))
      : true;
    const loop = localStorage.getItem("loop")
      ? JSON.parse(localStorage.getItem("loop"))
      : false;
    const currentTrack = audioList[index];

    if (!english) {
      this.fetchText(index);
    }

    console.log("stop: ", stop);
    console.log("clickNplay: ", clickNplay);
    console.log("loop: ", loop);
    // console.log("local: ", JSON.parse(localStorage.getItem("index")));
    // const type2 = typeof JSON.parse(localStorage.getItem("index"));
    // console.log("type: ", type2);

    const Content = settings
      ? this.settingsContent(stop, clickNplay, loop)
      : this.htmlContent();
    const playPause = !pause ? "play" : "pause";
    const display = !pause ? { display: "none" } : { display: "inline-block" };

    return (
      <div className="card">
        <div className="current-track">
          <div className="control-wrapper">
            <audio ref={(ref) => (this.playerRef = ref)}>
              <source src={allAudioFiles[`${index}.mp3`]} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <div className="text-wrap" onClick={this.toggleText}>
              {Content}
            </div>
            <div className="time">
              <div className="current-time">{currentTime}</div>
              <div className="playing-animation">
                <span className="playing__bar playing__bar1" style={display} />
                <span className="playing__bar playing__bar2" style={display} />
                <span className="playing__bar playing__bar3" style={display} />
              </div>
              <div className="end-time">{currentTrack.duration}</div>
            </div>
            <div ref={(ref) => (this.timelineRef = ref)} id="timeline">
              <div ref={(ref) => (this.playheadRef = ref)} id="playhead"></div>
              {/* <div
                ref={(ref) => (this.hoverPlayheadRef = ref)}
                className="hover-playhead"
                data-content="0:00"
              ></div> */}
            </div>
            <div className="controls">
              <button onClick={this.infoApp} className="info" />
              <button onClick={this.backFive} className="back-5" />
              <button onClick={this.playOrPause} className={playPause} />
              <button onClick={this.forwardFive} className="forward-5" />
              <button onClick={this.settingsOpen} className="settings" />
            </div>
          </div>
        </div>
        <div className="play-list">
          {audioList.map((track, key = 0) => (
            <div
              key={key}
              onClick={() => this.clickAudio(key)}
              id={"track" + key}
              className={
                "track " +
                (index === key && !pause ? "current-audio" : "") +
                (index === key && pause ? "play-now" : "")
              }
            >
              <div className="track-info-container">
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
