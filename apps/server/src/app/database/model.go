package database

import (
	"time"

	"gorm.io/gorm"
	"github.com/satori/go.uuid"
)

/*
 * @dev a list of models for pawcon server.
 * Based on https://docs-pawcon.netlify.app/web/server/#erd
 */
type User struct {
	gorm.Model
	UserId uuid.UUID `gorm:"primary_key" json:"user_id"`
	Firstname  string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email string `json:"email"`
	Username string `json:"username"`
}

type Voter struct {
	gorm.Model
	VoterId uuid.UUID `gorm:"primary_key" json:"voter_id"`
	UserId uuid.UUID `gorm:"foreign_key" json:"user_id"`
	VotingPower int `json:"voterPower"`
	VotingHistory int `json:"voterHistory"`
}

type VoteForm struct {
	gorm.Model
	FormId uuid.UUID `gorm:"primary_key" json:"form_id"`
	VoterId uuid.UUID `gorm:"foreign_key" json:"voter_id"`
	AgendaId uuid.UUID `gorm:"foreign_key" json:"agenda_id"`
	Agree uint `json:"choice_type"`
	Against uint `json:"choice_type"`
}

type Agenda struct {
	gorm.Model
	AgendaId uuid.UUID `gorm:"primary_key" json:"agenda_id"`
	Name string `json:"name"`
	Description string `json:"description"`
	IsPassed bool `json:"is_passed"`
}

type NFT struct {
	UserId uuid.UUID `gorm:"foreign_key" json:"user_id"`
	Name string `json:"name"`
	TokenId uint `json:"tokenId"`
	TokenURI string `json:"tokenURI"`
	Price uint `json:"price"`
}

type Staking struct {
	UserId uuid.UUID `gorm:"foreign_key" json:"user_id"`
	ERC20Balance uint `json:"erc20_balance"`
	ERC721Balance uint `json:"erc721_balance"`
	ERC20Reward uint `json:"erc20_reward"`
	ERC721Reward uint `json:"erc721_reward"`
}

type Feedback struct {
	PostId uuid.UUID `gorm:"primary_key" json:"post_id"`
	Title string `json:"title"`
	Description string `json:"description"`
	Author string `json:"author"`
	Editted_At time.Time `json:"editted_at"`
}

type Comment struct { 
	PostId uuid.UUID `gorm:"foreign_key" json:"post_id"`
	Author string `json:"author"`
	Description string `json:"description"`
	Editted_At time.Time `json:"editted_at"`
}

type Wallet struct { 
	WalletId uuid.UUID `gorm:"primary_key" json:"walletId"`
	UserId uuid.UUID `gorm:"foreign_key" json:"user_id"`
	PublicKey string `json:"publickey"`
	PrivateKey uint `json:"privatekey"`
	Balance uint `json:"balance"`
	Whitelist bool `json:"whitelist"`
}

func ReturnAllModel() []interface{} {
	var models []interface{}
	var user *User
	var voter *Voter
	var voteForm *VoteForm
	var agenda *Agenda
	var nft *NFT
	var staking *Staking
	var feedback *Feedback
	var wallet *Wallet
	var comment *Comment
	models = append(models, &user, &voter, &voteForm, &agenda, &nft, &staking, &feedback, &wallet, &comment)
	return models 
}

func SetVotingChoiceType(vf *VoteForm)  {
	const (
		_agree = iota
		_against
	)

	vf.Agree = _agree
	vf.Against = _against
}
