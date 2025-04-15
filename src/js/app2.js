const Web3 = require('web3');
const contract = require('@truffle/contract');
const votingArtifacts = require('../../build/contracts/Voting.json');
const VotingContract = contract(votingArtifacts);

window.App = {
  account: null,
  contractInstance: null,

  eventStart: async function () {
    try {
      // Request accounts from MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Set web3 provider to window.ethereum
      const web3 = new Web3(window.ethereum);
      VotingContract.setProvider(window.ethereum);

      // Get connected network ID using ethereum.request()
      const networkId = await web3.eth.net.getId();  // Now using the correct web3 instance
      console.log("Connected to network ID:", networkId);

      // Ensure contract is deployed to the detected network
      const deployedNetwork = votingArtifacts.networks[networkId];
      if (!deployedNetwork) {
        throw new Error("Voting contract not deployed on this network (ID: " + networkId + ")");
      }

      // Create contract instance at deployed address
      const instance = await VotingContract.at(deployedNetwork.address);
      App.contractInstance = instance;

      // Set current user account
      const accounts = await web3.eth.getAccounts();
      App.account = accounts[0];
      $("#accountAddress").html("Your Account: " + App.account);

      // Load candidate count
      const countCandidates = await instance.getCountCandidates();
      window.countCandidates = countCandidates;

      // Ready DOM interactivity
      $(document).ready(function () {
        $('#addCandidate').click(async function () {
          const nameCandidate = $('#name').val();
          const partyCandidate = $('#party').val();
          if (nameCandidate && partyCandidate) {
            await instance.addCandidate(nameCandidate, partyCandidate, { from: App.account });
            window.location.reload(); // Reload to show new candidate
          }
        });

        $('#addDate').click(async function () {
          const startDate = Date.parse(document.getElementById("startDate").value) / 1000;
          const endDate = Date.parse(document.getElementById("endDate").value) / 1000;
          await instance.setDates(startDate, endDate, { from: App.account });
          console.log("Dates set.");
          window.location.reload(); // Reload to update date view
        });

        instance.getDates().then(function (result) {
          const startDate = new Date(result[0] * 1000);
          const endDate = new Date(result[1] * 1000);
          $("#dates").text(startDate.toDateString() + " - " + endDate.toDateString());
        }).catch(err => console.error("Error fetching dates:", err));
      });

      // Load candidates
      for (let i = 0; i < countCandidates; i++) {
        const data = await instance.getCandidate(i + 1);
        const id = data[0];
        const name = data[1];
        const party = data[2];
        const voteCount = data[3];
        const viewCandidates = ` 
          <tr>
            <td><input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}> ${name}</td>
            <td>${party}</td>
            <td>${voteCount}</td>
          </tr>`;
        $("#boxCandidate").append(viewCandidates);
      }

      // Check if already voted
      const voted = await instance.checkVote({ from: App.account });
      if (!voted) {
        $("#voteButton").attr("disabled", false);
      }

    } catch (err) {
      console.error("ERROR! " + err.message);
      alert("Voting contract is not deployed on this network.\nPlease switch your MetaMask to Ganache (http://127.0.0.1:7545) and reload.");
    }
  },

  vote: async function () {
    const candidateID = $("input[name='candidate']:checked").val();
    if (!candidateID) {
      $("#msg").html("<p>Please vote for a candidate.</p>");
      return;
    }

    try {
      const instance = App.contractInstance;
      await instance.vote(parseInt(candidateID), { from: App.account });
      $("#voteButton").attr("disabled", true);
      $("#msg").html("<p>Voted</p>");
      window.location.reload();
    } catch (err) {
      console.error("ERROR! " + err.message);
    }
  }
};

// Load event on window start
window.addEventListener("load", function () {
  if (typeof window.ethereum !== "undefined") {
    window.App.eventStart();
  } else {
    alert("Please install MetaMask!");
  }
});
