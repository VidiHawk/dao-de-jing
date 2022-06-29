# from pydub import AudioSegment

# sound = AudioSegment.from_mp3("dao.mp3")

# # len() and slicing are in milliseconds
# halfway_point = len(sound) / 2
# second_half = sound[halfway_point:]

# # Concatenation is just adding
# second_half_3_times = second_half + second_half + second_half

# # writing mp3 files is a one liner
# # second_half_3_times.export("/path/to/new/file.mp3", format="mp3")

# # Adding a silent gap
# # If you'd like to add silence between parts of a sound:

# two_sec_silence = AudioSegment.silent(duration=2000)
# sound_with_gap = sound[:1000] + two_sec_silence + sound[1000:]


# print(len(sound))


import subprocess
import datetime
import ffmpeg
from pprint import pprint  # for printing Python dictionaries in a human-readable way


file = "dao.mp3"

# check an audio file basic metadata and duration
def probe_duration(filename):
    args = ("ffprobe", "-show_entries", "format=duration", "-i", filename)
    popen = subprocess.Popen(args, stdout=subprocess.PIPE)
    popen.wait()
    output = popen.stdout.read()


def probe_metadata(filename):
    pprint(ffmpeg.probe(filename)["streams"])


slices = [
    ["00:00:00", "00:00:14"],
    ["00:00:14", "00:00:48"],
    ["00:00:48", "00:01:33"],
    ["00:01:33", "00:02:07.5"],
    ["00:02:07.5", "00:02:30.5"],
    ["00:02:30.5", "00:02:55"],
    ["00:02:55", "00:03:10"],
    ["00:03:10", "00:03:35"],
    ["00:03:35", "00:04:05"],
    ["00:04:05", "00:04:27.5"],
    ["00:04:27.5", "00:05:03.5"],  # changed
    ["00:05:03.5", "00:05:29.5"],  # changed
    ["00:05:29.5", "00:05:55.5"],  # changed
    ["00:05:55.5", "00:06:35.5"],
    ["00:06:35.5", "00:07:20"],
    ["00:07:20", "00:08:06"],
    ["00:08:06", "00:08:43.5"],
    ["00:08:43.5", "00:09:09.5"],
    ["00:09:09.5", "00:09:27"],
    ["00:09:27", "00:09:51"],
    ["00:09:51", "00:10:56"],
    ["00:10:56", "00:11:32.5"],
    ["00:11:32.5", "00:12:12"],
    ["00:12:12", "00:12:53.5"],
    ["00:12:53.5", "00:13:18"],
    ["00:13:18", "00:14:01.5"],
    ["00:14:01.5", "00:14:25.5"],
    ["00:14:25.5", "00:15:09.5"],
    ["00:15:09.5", "00:15:55"],
    ["00:15:55", "00:16:28"],
    ["00:16:28", "00:17:05"],
]


def durations():
    duration_list = []
    for i in range(len(slices)):
        mysubtract = datetime.timedelta()
        indtime = slices[i][1]
        (h, m, s) = indtime.split(":")
        a = datetime.timedelta(minutes=int(float(m)), seconds=int(float(s)))
        bartime = slices[i][0]
        (h, m, s) = bartime.split(":")
        b = datetime.timedelta(minutes=int(float(m)), seconds=int(float(s)))
        mysubtract = a - b
        time = str(mysubtract)[-5:]
        duration_list.append(time)
    print(duration_list)


def slice():
    for i in range(len(slices)):
        start = slices[i][0]
        end = slices[i][1]
        output = str(i)
        d = subprocess.getoutput(
            'ffmpeg -i "{0}" -ss {1} -to {2} {3}.mp3'.format(file, start, end, output)
        )
        print(d)


durations()
# slice()
# probe_metadata("out.mp3")
