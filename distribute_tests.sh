#!/bin/bash
#===============================================================================
#
#          FILE:  distribute_tests.sh
#
#         USAGE:  ./distribute_tests.sh
#
#   DESCRIPTION:  This script slices testsuites across multiple agents for faster execution.
#                 We search for specific type of file structure (in this example test*), and slice them according to agent number
#                 If we encounter multiple files [file1..file10] and if we have 2 agents, agent1 executes tests odd number of files while agent2 executes even number of files
#                 We use JUnit test results to publish the test reports.
#
#===============================================================================

shopt -s globstar nullglob
tests=( */**/*"spec.ts" ) ## search folders starting with 0 and contains test pattern *spec.js

IFS=$'\n' tests=($(sort <<<"${tests[*]}"))
unset IFS

totalAgents=$SYSTEM_TOTALJOBSINPHASE # standard VSTS variables available using parallel execution; total number of parallel jobs running
agentNumber=$SYSTEM_JOBPOSITIONINPHASE # current job position
testCount=${#tests[@]}

if [ $totalAgents -eq 0 ]; then totalAgents=1; fi # below conditions are used if parallel pipeline is not used. i.e. pipeline is running with single agent (no parallel configuration)
if [ -z "$agentNumber" ]; then agentNumber=1; fi

echo "Total agents: $totalAgents"
echo "Agent number: $agentNumber"
echo "Total test files: $testCount"
echo "--------------------------------"