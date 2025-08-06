ifndef VERBOSE
.SILENT:
endif

RESOURCES := $(shell find . -name Main.java -print)
all: whittle

whittle: $(RESOURCES)
	javac $(RESOURCES)

run: whittle
	java Main