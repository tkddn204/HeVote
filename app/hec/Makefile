# Copyright (C) 2012-2017 IBM Corp.
#
# This program is Licensed under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance
# with the License. You may obtain a copy of the License at
#   http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License. See accompanying LICENSE file.

CC = g++

#CFLAGS = -g -O2 -std=c++11 -DDEBUG_PRINTOUT -Wfatal-errors -Wshadow -Wall -I/usr/local/include
CFLAGS = -g -O2 -std=c++11 -pthread -DFHE_THREADS -DFHE_BOOT_THREADS -fmax-errors=2

#  If you get compilation errors, you may need to add -std=c++11 or -std=c++0x
$(info HElib requires NTL version 10.0.0 or higher, see http://shoup.net/ntl)
$(info If you get compilation errors, try to add/remove -std=c++11 in Makefile)

LD = g++
AR = ar
ARFLAGS=rv
GMP=-lgmp
NTL=-lntl

# NOTE: NTL and GMP are distributed under LGPL (v2.1), so you can link
#       against them as dynamic libraries.
LDLIBS = -L/usr/local/lib $(NTL) $(GMP) -lm

SRC_DIR = ./src
OBJ_DIR = ./obj
BIN_DIR = ./bin

fhe.a = ./HElib/fhe.a

# ref: https://stackoverflow.com/a/4320498
# OBJECTS = createKeys.o encrypt_candidate_list.o tally.o

testx: test.cpp fhe.a
        $(CC) $(CFLAGS) -o $@ $< fhe.a $(LDLIBS)

all: $(OBJECTS)

# ref: https://stackoverflow.com/a/7005912
OBJECTS := $(SOURCES:$(SRC_DIR)/%.cpp=$(OBJ_DIR)/%.o)
$(OBJECTS): $(OBJ_DIR)/%.o : $(SRC_DIR)/%.cpp fhe.a
        $(CC) $(CFLAGS) -c $< -o fhe.a $@ $(LDLIBS)
        @echo "Compiled "$<" successfully!"

clean:
        rm -f $(OBJ_DIR)/*.o $(BIN_DIR)/*

info:
        : Homomorphic Encryption Connector(for HeVote) require HElib.
        : please execute `make` at app/hec/HElib.
        :
