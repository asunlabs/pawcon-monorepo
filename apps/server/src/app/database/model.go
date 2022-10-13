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
	Firstname  string `gorm:"not null" json:"firstname"`
	Lastname string `gorm:"not null" json:"lastname"`
	Email string `gorm:"not null;unique" json:"email"`
	Username string `gorm:"not null" json:"username"`
}

type Voter struct {
	gorm.Model
	UserId uuid.UUID `gorm:"foreignKey" json:"userId"`
	VotingPower int `json:"voterPower"`
	VotingHistory int `json:"voterHistory"`
}

type VoteForm struct {
	gorm.Model
	VoterId uuid.UUID `gorm:"foreignKey" json:"voterId"`
	AgendaId uuid.UUID `gorm:"foreignKey" json:"agendaId"`
	Agree uint `json:"choiceTypeAgree"`
	Against uint `json:"choiceTypeAgainst"`
}

type Agenda struct {
	gorm.Model
	Name string `json:"name"`
	Description string `json:"description"`
	IsPassed bool `json:"isPassed"`
}

type NFT struct {
	gorm.Model
	UserId uuid.UUID `gorm:"foreignKey" json:"userId"`
	Name string `json:"name"`
	TokenId uint `gorm:"not null" json:"tokenId"`
	TokenURI string `gorm:"not null" json:"tokenURI"`
	Price uint `json:"price"`
}

type Staking struct {
	gorm.Model
	UserId uuid.UUID `gorm:"foreignKey" json:"userId"`
	ERC20Balance uint `json:"erc20Balance"`
	ERC721Balance uint `json:"erc721Balance"`
	ERC20Reward uint `json:"erc20Reward"`
	ERC721Reward uint `json:"erc721Reward"`
}

type Feedback struct {
	gorm.Model
	Title string `gorm:"not null" json:"title"`
	Description string `gorm:"not null" json:"description"`
	Author string `gorm:"not null" json:"author"`
	EdittedAt time.Time `json:"edittedAt"`
}

type Comment struct { 
	PostId uuid.UUID `gorm:"foreignKey" json:"postId"`
	Author string `gorm:"not null" json:"author"`
	Description string `gorm:"not null" json:"description"`
	EdittedAt time.Time `json:"edittedAt"`
}

type Wallet struct { 
	gorm.Model
	UserId uuid.UUID `gorm:"foreignKey" json:"userId"`
	PublicKey string `gorm:"not null" json:"publickey"`
	PrivateKey uint `gorm:"not null" json:"privatekey"`
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
