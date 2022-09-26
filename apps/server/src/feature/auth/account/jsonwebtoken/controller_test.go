package jsonwebtoken_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestJsonwebtoken(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Jsonwebtoken Suite")
}

var _ = Describe("jsonwebtoken package", func() {
	It("Should be true", func() {
		five := 5
		Expect(five).To(Equal(5))
	})
})
