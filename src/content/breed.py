import shutil

src = "/chapter.jsx"

for i in range(5):
    dst = "/chapter{0}".format(i)

    shutil.copyfile(src, dst)
