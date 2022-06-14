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
    ["00:00:01", "00:00:14"],
    ["00:00:14", "00:00:48"],
    ["00:00:48", "00:01:33"],
    ["00:01:33", "00:02:07"],
    ["00:02:07", "00:02:30"],
]


def slice():
    for i in range(len(slices)):
        start = slices[i][0]
        end = slices[i][1]
        output = str(i)
        d = subprocess.getoutput(
            'ffmpeg -i "{0}" -ss {1} -to {2} {3}.mp3'.format(file, start, end, output)
        )
        print(d)


slice()
# probe_metadata("out.mp3")
