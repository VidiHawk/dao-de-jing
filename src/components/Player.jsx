import React from "react";
import { marked } from "marked";
import "../css/player.scss";

function importAll(r) {
  let allFiles = {};
  r.keys().map((item, index) => {
    allFiles[item.replace("./", "")] = r(item);
  });
  return allFiles;
}

const allAudio = importAll(require.context("../audio", false, /\.(mp3)$/));

const audioDurations = [
  "00:14",
  "00:34",
  "00:45",
  "00:34",
  "00:23",
  "00:25",
  "00:15",
  "00:25",
  "00:30",
  "00:22",
  "00:36",
  "00:26",
  "00:26",
  "00:40",
  "00:45",
  "00:46",
  "00:37",
  "00:26",
  "00:18",
  "00:24",
  "01:05",
];

const introText = [];

function fetchIntro(arg) {
  const importedText = require(`../content/${arg}.md`);
  fetch(importedText)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      introText.push(marked(text));
    });
}

fetchIntro("english/intro");
fetchIntro("mandarin/intro");

class Player extends React.Component {
  state = {
    index: 0,
    currentTime: "00:00",
    audioList: [
      {
        name: "道德经",
        duration: audioDurations[0],
      },
      {
        name: "第一章",
        duration: audioDurations[1],
      },
      {
        name: "第二章",
        duration: audioDurations[2],
      },
      {
        name: "第三章",
        duration: audioDurations[3],
      },
      {
        name: "第四章",
        duration: audioDurations[4],
      },
      {
        name: "第五章",
        duration: audioDurations[5],
      },
      {
        name: "第六章",
        duration: audioDurations[6],
      },
      {
        name: "第七章",
        duration: audioDurations[7],
      },
      {
        name: "第八章",
        duration: audioDurations[8],
      },
      {
        name: "第九章",
        duration: audioDurations[9],
      },
      {
        name: "第十章",
        duration: audioDurations[10],
      },
      {
        name: "第十一章",
        duration: audioDurations[11],
      },
      {
        name: "第十二章",
        duration: audioDurations[12],
      },
      {
        name: "第十三章",
        duration: audioDurations[13],
      },
      {
        name: "第十四章",
        duration: audioDurations[14],
      },
      {
        name: "第十五章",
        duration: audioDurations[15],
      },
      {
        name: "第十六章",
        duration: audioDurations[16],
      },
      {
        name: "第十七章",
        duration: audioDurations[17],
      },
      {
        name: "第十八章",
        duration: audioDurations[18],
      },
      {
        name: "第十九章",
        duration: audioDurations[19],
      },
      {
        name: "第二十章",
        duration: audioDurations[20],
      },
      {
        name: "214个部首",
      },
      {
        name: "100个部首",
      },
    ],
    pause: false,
    translation: false,
    info: false,
  };

  componentDidMount() {
    this.playerRef.addEventListener("timeupdate", this.timeUpdate, false);
    this.playerRef.addEventListener("ended", this.playOrPause, false);
    this.timelineRef.addEventListener("click", this.changeCurrentTime, false);
    this.timelineRef.addEventListener("mousemove", this.hoverTimeLine, false);
    this.timelineRef.addEventListener("mouseout", this.resetTimeLine, false);
  }

  componentWillUnmount() {
    this.playerRef.removeEventListener("timeupdate", this.timeUpdate);
    this.playerRef.removeEventListener("ended", this.playOrPause);
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
    const formatTime = minutes + "0" + ":" + seconds;
    return formatTime;
  };

  updatePlayer = () => {
    const { audioList, index } = this.state;
    const currentTrack = audioList[index];
    const audio = new Audio(currentTrack.audio);
    this.playerRef.load();
  };

  backFive = () => {
    const newTime = this.playerRef.currentTime - 5;
    this.playerRef.currentTime = newTime;
  };

  forwardFive = () => {
    const newTime = this.playerRef.currentTime + 5;
    this.playerRef.currentTime = newTime;
  };

  // nextSong = () => {
  //   const { audioList, index, pause } = this.state;
  //   const newIndex = (index + 1) % audioList.length;
  //   this.fetchText(newIndex);
  //   this.setState({
  //     index: newIndex,
  //   });
  //   this.updatePlayer();
  //   if (pause) {
  //     this.playerRef.play();
  //   }
  // };

  // prevSong = () => {
  //   const { audioList, index, pause } = this.state;
  //   const newIndex = (index + audioList.length - 1) % audioList.length;
  //   this.fetchText(newIndex);
  //   this.setState({
  //     index: newIndex,
  //   });
  //   this.updatePlayer();
  //   if (pause) {
  //     this.playerRef.play();
  //   }
  // };

  playOrPause = () => {
    const { audioList, index, pause } = this.state;
    const currentTrack = audioList[index];
    const audio = new Audio(currentTrack.audio);
    this.fetchText(index);
    if (!this.state.pause) {
      this.playerRef.play();
    } else {
      this.playerRef.pause();
    }
    this.setState({
      pause: !pause,
      info: false,
    });
  };

  clickAudio = (key) => {
    const { pause } = this.state;
    this.setState({
      index: key,
      info: false,
    });

    this.fetchText(key);
    this.updatePlayer();
    if (!pause) {
      this.setState({
        pause: !pause,
      });
    }
    this.playerRef.play();
  };

  infoApp = () => {
    const { pause, translation } = this.state;
    if (translation) {
      this.setState({
        translation: !translation,
      });
    }
    this.setState({
      mandarin: introText[0],
      english: introText[1],
      info: true,
    });
    if (pause) {
      this.playerRef.pause();
      this.setState({
        pause: !pause,
      });
    }
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

  toggleText = () => {
    const { translation } = this.state;
    this.setState({
      translation: !translation,
    });
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
    if (!english) {
      this.fetchText(index);
    }
    const textContent = translation ? mandarin : english;
    // const cardStyle = !translation ? "text-card-chinese" : "text-card-english";
    const cardStyle = this.cardStyle();
    const playPause = !pause ? "play" : "pause";
    const display = !pause ? { display: "none" } : { display: "inline-block" };

    return (
      <div className="card">
        <div className="current-track">
          <audio ref={(ref) => (this.playerRef = ref)}>
            <source src={allAudio[`${index}.mp3`]} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
          <div className="text-wrap" onClick={this.toggleText}>
            <article
              className={cardStyle}
              dangerouslySetInnerHTML={{ __html: textContent }}
            ></article>
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
            <div
              ref={(ref) => (this.hoverPlayheadRef = ref)}
              className="hover-playhead"
              data-content="0:00"
            ></div>
          </div>
          <div className="controls">
            <button onClick={this.infoApp} className="info" />
            <button onClick={this.backFive} className="back-5" />
            {/* <button onClick={this.prevSong} className="prev" /> */}
            <button onClick={this.playOrPause} className={playPause} />
            {/* <button onClick={this.nextSong} className="next" /> */}
            <button onClick={this.forwardFive} className="forward-5" />
            <button onClick={this.settingsApp} className="settings" />
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
