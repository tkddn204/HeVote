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
#
# Modified by SsangWoo, for HeVote.
#


CC = g++

HELIB_DIR = HElib/src

#CFLAGS = -g -O2 -std=c++11 -DDEBUG_PRINTOUT -Wfatal-errors -Wshadow -Wall -I/usr/local/include
CFLAGS = -g -O2 -std=c++11 -pthread -DFHE_THREADS -DFHE_BOOT_THREADS -fmax-errors=2 -I$(HELIB_DIR)

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

OBJ = $(HELIB_DIR)/NumbTh.o $(HELIB_DIR)/timing.o $(HELIB_DIR)/bluestein.o $(HELIB_DIR)/PAlgebra.o  $(HELIB_DIR)/CModulus.o $(HELIB_DIR)/FHEContext.o $(HELIB_DIR)/IndexSet.o $(HELIB_DIR)/DoubleCRT.o $(HELIB_DIR)/FHE.o $(HELIB_DIR)/KeySwitching.o $(HELIB_DIR)/Ctxt.o $(HELIB_DIR)/EncryptedArray.o $(HELIB_DIR)/replicate.o $(HELIB_DIR)/hypercube.o $(HELIB_DIR)/matching.o $(HELIB_DIR)/powerful.o $(HELIB_DIR)/BenesNetwork.o $(HELIB_DIR)/permutations.o $(HELIB_DIR)/PermNetwork.o $(HELIB_DIR)/OptimizePermutations.o $(HELIB_DIR)/eqtesting.o $(HELIB_DIR)/polyEval.o $(HELIB_DIR)/extractDigits.o $(HELIB_DIR)/EvalMap.o $(HELIB_DIR)/recryption.o $(HELIB_DIR)/debugging.o $(HELIB_DIR)/matmul.o $(HELIB_DIR)/intraSlot.o $(HELIB_DIR)/binaryArith.o $(HELIB_DIR)/binaryCompare.o $(HELIB_DIR)/tableLookup.o $(HELIB_DIR)/binio.o

SRC_DIR = ./src
BIN_DIR = ./bin

fhe.a = $(HELIB_DIR)/fhe.a

# ref: https://stackoverflow.com/a/7005912
BINARYS = $(BIN_DIR)/createKeys $(BIN_DIR)/encryptCandidateList $(BIN_DIR)/tally

all: $(BINARYS)

$(HELIB_DIR)/fhe.a: $(OBJ)
	$(AR) $(ARFLAGS) fhe.a $(OBJ)

$(BIN_DIR)/%: $(SRC_DIR)/%.cpp $(HELIB_DIR)/fhe.a
	$(CC) $(CFLAGS) -o $@ $< $(fhe.a) $(LDLIBS)
	@echo "Compiled "$<" successfully!"

# g++ -g -O2 -std=c++11 -pthread -DFHE_THREADS -DFHE_BOOT_THREADS -fmax-errors=2 -o testx test.cpp fhe.a -L/usr/local/lib -lntl -lgmp -lm

clean:
	rm -f $(BIN_DIR)/*

info:
	: Homomorphic Encryption Connector(for HeVote) require HElib.
	: please execute `make` at app/hec/HElib.
	:
