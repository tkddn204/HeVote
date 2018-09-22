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

HEADER = EncryptedArray.h FHE.h Ctxt.h CModulus.h FHEContext.h PAlgebra.h DoubleCRT.h NumbTh.h bluestein.h IndexSet.h timing.h IndexMap.h replicate.h hypercube.h matching.h powerful.h permutations.h polyEval.h multicore.h EvalMap.h matmul.h PtrVector.h PtrMatrix.h intraSlot.h recryption.h debugging.h binaryArith.h binaryCompare.h tableLookup.h binio.h

SRC = KeySwitching.cpp EncryptedArray.cpp FHE.cpp Ctxt.cpp CModulus.cpp FHEContext.cpp PAlgebra.cpp DoubleCRT.cpp NumbTh.cpp bluestein.cpp IndexSet.cpp timing.cpp replicate.cpp hypercube.cpp matching.cpp powerful.cpp BenesNetwork.cpp permutations.cpp PermNetwork.cpp OptimizePermutations.cpp eqtesting.cpp polyEval.cpp extractDigits.cpp EvalMap.cpp recryption.cpp debugging.cpp matmul.cpp intraSlot.cpp binaryArith.cpp binaryCompare.cpp tableLookup.cpp binio.cpp

OBJ = NumbTh.o timing.o bluestein.o PAlgebra.o  CModulus.o FHEContext.o IndexSet.o DoubleCRT.o FHE.o KeySwitching.o Ctxt.o EncryptedArray.o replicate.o hypercube.o matching.o powerful.o BenesNetwork.o permutations.o PermNetwork.o OptimizePermutations.o eqtesting.o polyEval.o extractDigits.o EvalMap.o recryption.o debugging.o matmul.o intraSlot.o binaryArith.o binaryCompare.o tableLookup.o binio.o

all: fhe.a

obj: $(OBJ)

DoubleCRT.o: DoubleCRT.cpp $(HEADER)
        $(CC) $(CFLAGS) -c DoubleCRT.cpp

%.o: %.cpp $(HEADER)
        $(CC) $(CFLAGS) -c $<

fhe.a: $(OBJ)
        $(AR) $(ARFLAGS) fhe.a $(OBJ)

./%: %.cpp fhe.a
        $(CC) $(CFLAGS) -o $@ $< fhe.a $(LDLIBS)

clean:
        rm -f *.o *_x *_x.exe *.a core.*
        rm -rf *.dSYM

info:
        : HElib require NTL version 10.0.0 or higher
        : Compilation flags are 'CFLAGS=$(CFLAGS)'
        : If errors occur, try adding/removing '-std=c++11' in Makefile
        :
